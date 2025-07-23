 import React, { useContext, useState, useEffect } from "react"
 import { DateTime } from 'luxon'

 {/* Components largely borrowed from: https://www.material-tailwind.com/blocks/kpi-cards */}

// @material-tailwind/react
import {
  Button,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Card,
  CardBody,
} from "@material-tailwind/react";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { AppContext } from "../../context/AppContext";
import { currency_formatter } from "../../utils/utils";

export function KpiCard({ title, percentage, price, color, icon,}) {

  return (
    <Card className="shadow-sm border border-gray-200 !rounded-lg">
      <CardBody className="p-4">
        <div className="flex justify-between items-center">
          <Typography
            className="!font-medium !text-xs text-gray-600"
          >
            {title}
          </Typography>
          <div className="flex items-center gap-1">
            {icon}
            <Typography
              color={color}
                className="font-medium !text-xs"
            >
              {percentage}
            </Typography>
          </div>
        </div>
        <Typography
          color="blue-gray"
          className="mt-1 font-bold text-2xl"
        >
          {price}
        </Typography>
      </CardBody>
    </Card>
  );
}

function KpiCards( { restaurant_id, KPI_TIME_RANGE, kpi_time_range, setKPITimeRange, setOrders, setVisits } ) {
    const { base_url } = useContext(AppContext)

    // State Variables
    const [kpi_titles, setKPITitles] = useState(["Revenue", "Orders", "Page Visits", "New Consumers"])
    const [kpi_percentages, setKPIPercentages] = useState(new Array(4).fill("0%"))
    const [kpi_price, setKPIPrice] = useState(new Array(4).fill("0"))

    // getKPIValues Helpers
    const to_owner_time_zone = (data, time_var, time_zone) => (
        data.map(entry => ({
            ...entry,
            [time_var]: DateTime.fromISO(entry[time_var], {zone: "utc"}).setZone(time_zone)
        }))
    )
    const percent_change = (curr_period, prev_period) => {
        if(prev_period === 0) {
            return (curr_period === 0) ? "0%" : "New"
        }
        else {
            const percent_change = Math.floor( ( (curr_period - prev_period ) / prev_period ) * 100)
            return `${percent_change}`
        }
    }
    const get_relevant_time_periods = (data, time_var, curr_period_limit, prev_period_limit) => {
        const curr_period_data = data.filter(entry => entry[time_var] >= curr_period_limit)
        const prev_period_data = data.filter(entry => (entry[time_var]  < curr_period_limit) && (entry[time_var] >= prev_period_limit))
        return {curr_period_data, prev_period_data}
    }


  const getKPIValues = async (date_time_period_limit, date_time_prev_period_limit) => {
      // Fetch orders data from the DB
      const orders_response = await fetch(base_url + `/analytics/orders/${restaurant_id}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
      })
      if(!orders_response.ok) {
          const err = new Error(`Status: ${orders_response.status}. Failed to retrieve orders info from DB`)
          err.status = orders_response.status
          throw err
      }

      // Fetch visits from the DB
      const visits_response = await fetch(base_url + `/analytics/visits/${restaurant_id}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
      })
      if(!visits_response.ok) {
          const err = new Error(`Status: ${visits_response.status}. Failed to retrieve visits info from DB`)
          err.status = visits_response.status
          throw err
      }

      const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone

      // Isolate orders from the last week
      const orders = await orders_response.json()
      const orders_owner_time = to_owner_time_zone(orders, "order_time", time_zone)
      const { curr_period_data: orders_curr_period, prev_period_data: orders_prev_period } = get_relevant_time_periods(orders_owner_time, "order_time", date_time_period_limit, date_time_prev_period_limit)
      setOrders(orders_curr_period)

      // Get total revenue & stats over last week
      const revenue_curr_period = orders_curr_period.reduce((net_revenue, order) => net_revenue + Number(order.cost), 0)
      const revenue_prev_period = orders_prev_period.reduce((net_revenue, order) => net_revenue + order.cost, 0)
      let revenue_percent_change = percent_change(revenue_curr_period, revenue_prev_period)

      // Get total orders & stats over last week
      const num_orders_curr_period = orders_curr_period.length
      const num_orders_prev_period = orders_prev_period.length
      let num_orders_percent_change = percent_change(num_orders_curr_period, num_orders_prev_period)

      // Get total & stats new consumers
      const first_time_orders_curr_period = orders_prev_period.filter((order) => order.is_first_order)
      const first_time_orders_prev_period = orders_prev_period.filter((order) => order.is_first_order)
      const num_new_consumers_curr_period = first_time_orders_curr_period.length
      const num_new_consumers_prev_period = first_time_orders_prev_period.length
      let num_new_consumers_percent_change = percent_change(num_new_consumers_curr_period, num_new_consumers_prev_period)

      // Get total page visits
      const visits = await visits_response.json()
      const visits_owner_time = to_owner_time_zone(visits, "visit_time", time_zone)

      // Get total & stats page visits
      const { curr_period_data: visits_curr_period, prev_period_data: visits_prev_period } = get_relevant_time_periods(visits_owner_time, "visit_time", date_time_period_limit, date_time_prev_period_limit)
      setVisits(visits_curr_period)

      const num_visits_curr_period = visits_curr_period.length
      const num_visits_prev_period = visits_prev_period.length
      let num_visits_percent_change = percent_change(num_visits_curr_period, num_visits_prev_period)

      // Set State Variables
      setKPIPrice([currency_formatter.format(revenue_curr_period).toString(), num_orders_curr_period, num_visits_curr_period, num_new_consumers_curr_period])
      setKPIPercentages([revenue_percent_change, num_orders_percent_change, num_visits_percent_change, num_new_consumers_percent_change])
  }

  // NOTE: Calls getKPIValues in a versatile way based on selected time period
  const getKPIValuesWrapper = async () => {
    switch(kpi_time_range) {
        case KPI_TIME_RANGE.LAST_WEEK: 
            const date_time_one_week_ago = DateTime.now().minus({ weeks: 1 })
            const date_time_two_weeks_ago = DateTime.now().minus({ weeks: 2 })
            
            await getKPIValues(date_time_one_week_ago, date_time_two_weeks_ago)

            break
      case KPI_TIME_RANGE.LAST_MONTH:
          const date_time_one_month_ago  = DateTime.now().minus({ months: 1 })
          const date_time_two_months_ago = DateTime.now().minus({ months: 2 })

          await getKPIValues(date_time_one_month_ago, date_time_two_months_ago)
          break
    }
  }

  useEffect(() => {
      getKPIValuesWrapper()
  }, [restaurant_id, kpi_time_range])

  return (
    <section className="container mx-auto py-20 px-8">
      <div className="flex justify-between md:items-center">
        <div>
          <Typography className="font-bold">Overall Performance</Typography>
          <Typography
            variant="small"
            className="font-normal text-gray-600 md:w-full w-4/5"
          >
          </Typography>
        </div>
        <div className="shrink-0">
          <Menu>
            <MenuHandler>
              <Button
                color="gray"
                variant="outlined"
                className="flex items-center gap-1 !border-gray-300"
              >
                {kpi_time_range}
                <ChevronDownIcon
                  strokeWidth={4}
                  className="w-3 h-3 text-gray-900"
                />
              </Button>
            </MenuHandler>
            <MenuList>
              <MenuItem onClick={() => setKPITimeRange(KPI_TIME_RANGE.LAST_WEEK)}>Last Week</MenuItem>
              <MenuItem onClick={() => setKPITimeRange(KPI_TIME_RANGE.LAST_MONTH)}>Last Month</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
      <div className="mt-6 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 items-center md:gap-2.5 gap-4">
        {kpi_titles.map((title, ind) => (
          <KpiCard title={title} percentage={kpi_percentages[ind]} price={kpi_price[ind]} color={(kpi_percentages[ind].charAt(0) === '-') ? 'red' : 'green'} icon={(kpi_percentages[ind].charAt(0) === '-') ? (<ChevronDownIcon strokeWidth={4} className="w-3 h-3 text-red-500"/>) : (<ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500"/>) }/>
        ))}
      </div>
    </section>
  );
}

export default KpiCards;