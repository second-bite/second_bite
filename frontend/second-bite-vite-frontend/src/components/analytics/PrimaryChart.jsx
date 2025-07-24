import React, { useEffect, useState } from "react"
import { DateTime } from 'luxon'
import { CartesianGrid, Legend, Line, Area, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


const PrimaryChart = ({ orders, visits, kpi_time_range, KPI_TIME_RANGE }) => {
    const [graph_data, setGraphData] = useState([])

    // TODO: Get standard deviation
    // Credit: https://www.indeed.com/career-advice/career-development/how-to-calculate-standard-deviation
    const get_standard_deviation = (data) => {
        const mean = data.reduce((accumulator, val) => accumulator + val, 0) / data.length
        const sum_squared_diff = data.reduce((accumulator, val) => accumulator + (val - mean) ** 2, 0)
        const standard_dev = Math.sqrt(sum_squared_diff / data.length)
        return standard_dev
    }

    const structureMonthlyData = () => {
        // Initialize maps
        const order_count_map = new Map()
        const visit_count_map = new Map()
        
        // Get totals per week
        for (const order of orders) {
            const day = order.order_time
            const map_key = `${day.weekNumber} ${day.weekYear}`  
            const week_order_count = order_count_map.get(map_key) || 0
            order_count_map.set(map_key, week_order_count + 1)    
        }
        for (const visit of visits) {
            const day = visit.visit_time
            const map_key = `${day.weekNumber} ${day.weekYear}` 
            const week_visit_count = visit_count_map.get(map_key) || 0
            visit_count_map.set(map_key, week_visit_count + 1)   
        }

        // Create array holding the weeks in the past month
        const now = DateTime.now()
        const weeks = Array.from({ length: 5 }).map((_, ind) => {
            const week = now.minus({ weeks: 4 - ind });
            return { 
                weekNumber: week.weekNumber, 
                weekYear: week.weekYear,
                key: `${week.weekNumber} ${week.weekYear}`   
            }
        })

        const new_data = weeks.map(week => {
            const start_of_week = DateTime.fromObject({
                weekYear: week.weekYear,
                weekNumber: week.weekNumber
            }).startOf("week")

            return {
                name: `Week of ${start_of_week.toFormat("MMM d")}`,
                orders: order_count_map.get(week.key) || 0,       
                visits: visit_count_map.get(week.key) || 0,  
                visits_low: visit_count_map.get(week.key) || 0, 
                visits_band: 0,
                orders_low: order_count_map.get(week.key) || 0,  
                orders_band: 0,
            }
        })

        // Add next month prediction
        const predicted_week = now.plus({ weeks: 1 })
        const start_of_predicted_week = DateTime.fromObject({
            weekYear: predicted_week.weekYear,
            weekNumber: predicted_week.weekNumber
        }).startOf("week")
        const order_num_arr = Array.from(order_count_map.values())
        const visit_num_arr = Array.from(visit_count_map.values())
        const predicted_name = `Week of ${start_of_predicted_week.toFormat("MMM d")}`
        const predicted_order = Array.from(order_count_map.values()).reduce((accumulator, val) => accumulator + val, 0) / 7
        const predicted_visit = Array.from(visit_count_map.values()).reduce((accumulator, val) => accumulator + val, 0) / 7

        // Add confidence interval to next day prediction
        // Credit: For confidence interval, I used: https://www.westga.edu/academics/research/vrc/assets/docs/confidence_intervals_notes.pdf
        const target_arr_length = 5 // Need an entry per week
        const padded_order_num_arr = order_num_arr.concat(Array(target_arr_length - order_num_arr.length).fill(0))
        const padded_visit_num_arr = visit_num_arr.concat(Array(target_arr_length - visit_num_arr.length).fill(0))
        const order_standard_dev = get_standard_deviation(padded_order_num_arr)
        const visit_standard_dev = get_standard_deviation(padded_visit_num_arr)
        const z_score = 1.96 // 95% Confidence Interval
        const order_err_margin = z_score * order_standard_dev / Math.sqrt(padded_order_num_arr.length)
        const visit_err_margin = z_score * visit_standard_dev / Math.sqrt(padded_visit_num_arr.length)
        new_data.push({ name: predicted_name, orders: predicted_order, visits: predicted_visit, 
                        visits_low: predicted_visit - visit_err_margin, visits_band: 2 * visit_err_margin,
                        orders_low: predicted_order - order_err_margin, orders_band: 2 * order_err_margin })

        setGraphData(new_data)
    }

    const structureWeeklyData = () => {
        // NOTE: Order time is in luxon DateTime

        // Initialize maps
        const order_count_map = new Map()
        const visit_count_map = new Map()
        
        // Get totals per day
        for (const order of orders) {
            const day = order.order_time.toISODate()

            const day_order_count = order_count_map.get(day) || 0
            order_count_map.set(day, day_order_count + 1)
        }
        for (const visit of visits) {
            const day = visit.visit_time.toISODate()

            const day_visit_count = visit_count_map.get(day) || 0
            visit_count_map.set(day, day_visit_count + 1)
        }

        // Create array holding last 7 weekdays from oldest to newest
        const now = DateTime.now().startOf('day')
        const week_by_days = Array.from({ length: 7 }).map((_, ind) => {
          return now.minus({ days: 6 - ind })
        })

        const new_data = week_by_days.map(day => ({
            name: day.toFormat('cccc'),
            orders: order_count_map.get(day.toISODate()) || 0,
            visits: visit_count_map.get(day.toISODate()) || 0,
            visits_low: visit_count_map.get(day.toISODate()) || 0,
            visits_band: 0,
            orders_low: order_count_map.get(day.toISODate()) || 0,
            orders_band: 0,
        }))

        // Add next day prediction
        const order_num_arr = Array.from(order_count_map.values())
        const visit_num_arr = Array.from(visit_count_map.values())
        const predicted_name = now.plus({ days: 1 }).toFormat('cccc')
        const predicted_order = order_num_arr.reduce((accumulator, val) => accumulator + val, 0) / 7
        const predicted_visit = visit_num_arr.reduce((accumulator, val) => accumulator + val, 0) / 7
        
        // Add confidence interval to next day prediction
        // Credit: For confidence interval, I used: https://www.westga.edu/academics/research/vrc/assets/docs/confidence_intervals_notes.pdf
        const target_arr_length = 7 // Need an entry per weekday
        const padded_order_num_arr = order_num_arr.concat(Array(target_arr_length - order_num_arr.length).fill(0))
        const padded_visit_num_arr = visit_num_arr.concat(Array(target_arr_length - visit_num_arr.length).fill(0))
        const order_standard_dev = get_standard_deviation(padded_order_num_arr)
        const visit_standard_dev = get_standard_deviation(padded_visit_num_arr)
        const z_score = 1.96 // 95% Confidence Interval
        const order_err_margin = z_score * order_standard_dev / Math.sqrt(padded_order_num_arr.length)
        const visit_err_margin = z_score * visit_standard_dev / Math.sqrt(padded_visit_num_arr.length)
        new_data.push({ name: predicted_name, orders: predicted_order, visits: predicted_visit, 
                        visits_low: predicted_visit - visit_err_margin, visits_band: 2 * visit_err_margin,
                        orders_low: predicted_order - order_err_margin, orders_band: 2 * order_err_margin })

        setGraphData(new_data)
    }

    useEffect(() => {
        if(kpi_time_range === KPI_TIME_RANGE.LAST_WEEK) {
            structureWeeklyData()
        }
        else {
            structureMonthlyData()
        }
    }, [orders, visits, kpi_time_range])

    return (
        <>
            <section className="analytics_graph">
              {/* Primary Chart */}
              {/* Code largely taken from:
                - https://recharts.org/en-US/examples/BiaxialLineChart 
                - https://recharts.org/en-US/api/AreaChart 
                - https://recharts.org/en-US/api/ComposedChart
                */}
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  width={500}
                  height={300}
                  data={graph_data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />

                  {/* Primary Lines */}
                  <Line yAxisId="left" type="monotone" dataKey="orders" name="orders" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="visits" name="visits" stroke="#82ca9d" />

                  {/* Confidence Interval Area - Orders */}
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders_low"
                    stackId="orders_confidence_interval"
                    stroke="none"
                    fill="transparent"
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders_band"
                    stackId="orders_confidence_interval"
                    stroke="none"
                    fill="#8884D8"
                    fillOpacity={0.2}
                  />

                  {/* Confidence Interval Area - Visits */}
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="visits_low"
                    stackId="visits_confidence_interval"
                    stroke="none"
                    fill="transparent"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="visits_band"
                    stackId="visits_confidence_interval"
                    stroke="none"
                    fill="#FA8072"
                    fillOpacity={0.2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </section>
        </>
    )
}


export default PrimaryChart