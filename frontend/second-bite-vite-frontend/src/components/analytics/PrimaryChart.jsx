import React, { useEffect, useState } from "react"
import { DateTime } from 'luxon'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


const PrimaryChart = ({ orders, visits, kpi_time_range, KPI_TIME_RANGE }) => {
    const [graph_data, setGraphData] = useState([])

    // TODO: Future prediction based on mean
    const add_prediction_point = () => {

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

        // TODO: Add next week prediction

        const new_data = weeks.map(week => {
            const start_of_week = DateTime.fromObject({
                weekYear: week.weekYear,
                weekNumber: week.weekNumber
            }).startOf("week")

            return {
                name: `Week of ${start_of_week.toFormat("MMM d")}`,
                orders: order_count_map.get(week.key) || 0,       
                visits: visit_count_map.get(week.key) || 0,  
            }
        })

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

        // TODO: Add next day prediction
        

        const new_data = week_by_days.map(day => ({
            name: day.toFormat('cccc'),
            orders: order_count_map.get(day.toISODate()) || 0,
            visits: visit_count_map.get(day.toISODate()) || 0,
        }))

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
              {/* Code largely taken from https://recharts.org/en-US/examples/BiaxialLineChart */}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
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
                  <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="visits" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </section>
        </>
    )
}


export default PrimaryChart