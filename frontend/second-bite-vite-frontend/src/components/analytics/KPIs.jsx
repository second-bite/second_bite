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

function KpiCards( { restaurant_id, KPI_TIME_RANGE, kpi_time_range, setKPITimeRange } ) {
  const { base_url } = useContext(AppContext)

  // State Variables
  const [kpi_titles, setKPITitles] = useState(["Revenue", "Orders", "Page Visits", "New Consumers"])
  const [kpi_percentages, setKPIPercentages] = useState(new Array(4).fill("0%"))
  const [kpi_price, setKPIPrice] = useState(new Array(4).fill("0"))

  const getKPIValues = async () => {
    switch(kpi_time_range) {
        case KPI_TIME_RANGE.LAST_WEEK: 
            // Fetch orders data from the DB
            const orders_response_week = await fetch(base_url + `/analytics/orders/${restaurant_id}`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            })
            if(!orders_response_week.ok) {
                const err = new Error(`Status: ${orders_response_week.status}. Failed to retrieve orders info from DB`)
                err.status = orders_response_week.status
                throw err
            }

            // Isolate orders from the last week
            const orders_week = await orders_response_week.json()
            const time_zone_week = Intl.DateTimeFormat().resolvedOptions().timeZone
            
            const orders_owner_time_week = orders_week.map((order) => {
                const order_utc_time = DateTime.fromISO(order.order_time, { zone: "utc" })
                const order_owner_time = order_utc_time.setZone(time_zone_week)
                return {
                    ...order,
                    order_time: order_owner_time,
                }
            })

            const date_time_one_week_ago = DateTime.now().minus({ weeks: 1 })
            const date_time_two_weeks_ago = DateTime.now().minus({ weeks: 2 })
            const orders_last_week = orders_owner_time_week.filter((order) => {
                return order.order_time  >= date_time_one_week_ago
            })
            const orders_week_before_last = orders_owner_time_week.filter((order) => {
                return ((order.order_time  < date_time_one_week_ago) && (order.order_time >= date_time_two_weeks_ago))
            })

            // Get total revenue & stats over last week
            const revenue_last_week = orders_last_week.reduce((net_revenue, order) => net_revenue + order.cost, 0)
            const revenue_week_before_last = orders_week_before_last.reduce((net_revenue, order) => net_revenue + order.cost, 0)
            let revenue_percent_change_week
            if (revenue_week_before_last === 0) {
                if(revenue_last_week === 0) revenue_percent_change_week = "0%"
                else revenue_percent_change_week = "New"
            }
            else {
                revenue_percent_change_week = Math.floor( (  ( revenue_last_week - revenue_week_before_last ) / revenue_week_before_last ) * 100 )
                revenue_percent_change_week = (revenue_percent_change_week >= 0) ? `${revenue_percent_change_week}%` :  `${revenue_percent_change_week}%`
            }

            // Get total orders & stats over last week
            const num_orders_last_week = orders_last_week.length
            const num_orders_week_before_last = orders_week_before_last.length
            let num_orders_percent_change_week
            if (num_orders_week_before_last === 0) {
                if(num_orders_last_week === 0) num_orders_percent_change_week = "0%"
                else num_orders_percent_change_week = "New"
            }
            else {
                num_orders_percent_change_week = Math.floor( (  ( num_orders_last_week - num_orders_week_before_last ) / num_orders_week_before_last ) * 100 )
                num_orders_percent_change_week = (num_orders_percent_change_week >= 0) ? `${num_orders_percent_change_week}%` :  `${num_orders_percent_change_week}%`
            }

            // Get total & stats new consumers
            const first_time_orders_one_week_ago = orders_last_week.filter((order) => {
                return order.is_first_order
            })
            const first_time_orders_week_before_last = orders_week_before_last.filter((order) => {
                return order.is_first_order
            })
            const num_new_consumers_last_week = first_time_orders_one_week_ago.length
            const num_new_consumers_week_before_last = first_time_orders_week_before_last.length
            let num_new_consumers_percent_change_week
            if(num_new_consumers_week_before_last === 0) {
                if(num_new_consumers_last_week === 0) num_new_consumers_percent_change_week = "0%"
                else num_new_consumers_percent_change_week = "New"
            }
            else {
                num_new_consumers_percent_change_week = Math.floor( (  ( num_new_consumers_last_week - num_new_consumers_week_before_last ) / num_new_consumers_week_before_last ) * 100 )
                num_new_consumers_percent_change_week = (num_new_consumers_percent_change_week >= 0) ? `${num_new_consumers_percent_change_week}%` :  `${num_new_consumers_percent_change_week}%`
            }

            // Fetch visits from the DB
            const visits_response_week = await fetch(base_url + `/analytics/visits/${restaurant_id}`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            })
            if(!visits_response_week.ok) {
                const err = new Error(`Status: ${visits_response_week.status}. Failed to retrieve visits info from DB`)
                err.status = visits_response_week.status
                throw err
            }

            // Get total page visits
            const visits_week = await visits_response_week.json()
            const visits_owner_time_week = visits_week.map((visit) => {
                const visit_utc_time = DateTime.fromISO(visit.visit_time, { zone: "utc" })
                const visit_owner_time = visit_utc_time.setZone(time_zone_week)
                return {
                    ...visit,
                    visit_time: visit_owner_time,
                }
            })

            // Get total & stats page visits
            const visits_last_week = visits_owner_time_week.filter((visit) => {
                return visit.visit_time  >= date_time_one_week_ago
            })
            const visits_week_before_last = visits_owner_time_week.filter((visit) => {
                return ((visit.visit_time  < date_time_one_week_ago) && (visit.visit_time >= date_time_two_weeks_ago))
            })

            const num_visits_last_week = visits_last_week.length
            const num_visits_week_before_last = visits_week_before_last.length
            let num_visits_percent_change_week
            if (num_visits_week_before_last === 0) {
                if(num_visits_last_week === 0) num_visits_percent_change_week = "0%"
                else num_visits_percent_change_week = "New"
            }
            else {
                num_visits_percent_change_week = Math.floor( (  ( num_visits_last_week - num_visits_week_before_last ) / num_visits_week_before_last ) * 100 )
                num_visits_percent_change_week = (num_visits_percent_change_week >= 0) ? `${num_visits_percent_change_week}%` :  `${num_visits_percent_change_week}%`
            }

            // Set State Variables
            setKPIPrice([currency_formatter.format(revenue_last_week).toString(), num_orders_last_week, num_visits_last_week, num_new_consumers_last_week])
            setKPIPercentages([revenue_percent_change_week, num_orders_percent_change_week, num_visits_percent_change_week, num_new_consumers_percent_change_week])

            break
      case KPI_TIME_RANGE.LAST_MONTH:
        // Fetch orders data from the DB
        const orders_response_month = await fetch(base_url + `/analytics/orders/${restaurant_id}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        })
        if(!orders_response_month.ok) {
            const err = new Error(`Status: ${orders_response_month.status}. Failed to retrieve orders info from DB`)
            err.status = orders_response_month.status
            throw err
        }

        // Isolate orders from the last month
        const orders_month = await orders_response_month.json()
        const time_zone_month = Intl.DateTimeFormat().resolvedOptions().timeZone
        
        const orders_owner_time_month = orders_month.map((order) => {
            const order_utc_time = DateTime.fromISO(order.order_time, { zone: "utc" })
            const order_owner_time = order_utc_time.setZone(time_zone_month)
            return {
                ...order,
                order_time: order_owner_time,
            }
        })

        const date_time_one_month_ago  = DateTime.now().minus({ months: 1 })
        const date_time_two_months_ago = DateTime.now().minus({ months: 2 })
        const orders_last_month        = orders_owner_time_month.filter((order) => {
            return order.order_time  >= date_time_one_month_ago
        })
        const orders_month_before_last = orders_owner_time_month.filter((order) => {
            return ((order.order_time  < date_time_one_month_ago) && (order.order_time >= date_time_two_months_ago))
        })

        // Get total revenue & stats over last month
        const revenue_last_month        = orders_last_month.reduce((net_revenue, order) => net_revenue + order.cost, 0)
        const revenue_month_before_last = orders_month_before_last.reduce((net_revenue, order) => net_revenue + order.cost, 0)
        let revenue_percent_change_month
        if (revenue_month_before_last === 0) {
            if(revenue_last_month === 0) revenue_percent_change_month = "0%"
            else revenue_percent_change_month = "New"
        }
        else {
            revenue_percent_change_month = Math.floor( (  ( revenue_last_month - revenue_month_before_last ) / revenue_month_before_last ) * 100 )
            revenue_percent_change_month = (revenue_percent_change_month >= 0) ? `${revenue_percent_change_month}%` :  `${revenue_percent_change_month}%`
        }

        // Get total orders & stats over last month
        const num_orders_last_month        = orders_last_month.length
        const num_orders_month_before_last = orders_month_before_last.length
        let num_orders_percent_change_month
        if (num_orders_month_before_last === 0) {
            if(num_orders_last_month === 0) num_orders_percent_change_month = "0%"
            else num_orders_percent_change_month = "New"
        }
        else {
            num_orders_percent_change_month = Math.floor( (  ( num_orders_last_month - num_orders_month_before_last ) / num_orders_month_before_last ) * 100 )
            num_orders_percent_change_month = (num_orders_percent_change_month >= 0) ? `${num_orders_percent_change_month}%` :  `${num_orders_percent_change_month}%`
        }

        // Get total & stats new consumers
        const first_time_orders_one_month_ago        = orders_last_month.filter((order) => {
            return order.is_first_order
        })
        const first_time_orders_month_before_last    = orders_month_before_last.filter((order) => {
            return order.is_first_order
        })
        const num_new_consumers_last_month           = first_time_orders_one_month_ago.length
        const num_new_consumers_month_before_last    = first_time_orders_month_before_last.length
        let num_new_consumers_percent_change_month
        if(num_new_consumers_month_before_last === 0) {
            if(num_new_consumers_last_month === 0) num_new_consumers_percent_change_month = "0%"
            else num_new_consumers_percent_change_month = "New"
        }
        else {
            num_new_consumers_percent_change_month = Math.floor( (  ( num_new_consumers_last_month - num_new_consumers_month_before_last ) / num_new_consumers_month_before_last ) * 100 )
            num_new_consumers_percent_change_month = (num_new_consumers_percent_change_month >= 0) ? `${num_new_consumers_percent_change_month}%` :  `${num_new_consumers_percent_change_month}%`
        }

        // Fetch visits from the DB
        const visits_response_month = await fetch(base_url + `/analytics/visits/${restaurant_id}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        })
        if(!visits_response_month.ok) {
            const err = new Error(`Status: ${visits_response_month.status}. Failed to retrieve visits info from DB`)
            err.status = visits_response_month.status
            throw err
        }

        // Get total page visits
        const visits_month = await visits_response_month.json()
        const visits_owner_time_month = visits_month.map((visit) => {
            const visit_utc_time   = DateTime.fromISO(visit.visit_time, { zone: "utc" })
            const visit_owner_time = visit_utc_time.setZone(time_zone_month)
            return {
                ...visit,
                visit_time: visit_owner_time,
            }
        })

        // Get total & stats page visits
        const visits_last_month        = visits_owner_time_month.filter((visit) => {
            return visit.visit_time  >= date_time_one_month_ago
        })
        const visits_month_before_last = visits_owner_time_month.filter((visit) => {
            return ((visit.visit_time  < date_time_one_month_ago) && (visit.visit_time >= date_time_two_months_ago))
        })

        const num_visits_last_month        = visits_last_month.length
        const num_visits_month_before_last = visits_month_before_last.length
        let num_visits_percent_change_month
        if (num_visits_month_before_last === 0) {
            if(num_visits_last_month === 0) num_visits_percent_change_month = "0%"
            else num_visits_percent_change_month = "New"
        }
        else {
            num_visits_percent_change_month = Math.floor( (  ( num_visits_last_month - num_visits_month_before_last ) / num_visits_month_before_last ) * 100 )
            num_visits_percent_change_month = (num_visits_percent_change_month >= 0) ? `${num_visits_percent_change_month}%` :  `${num_visits_percent_change_month}%`
        }

        // Set State Variables
        setKPIPrice([currency_formatter.format(revenue_last_month).toString(), num_orders_last_month, num_visits_last_month, num_new_consumers_last_month])
        setKPIPercentages([revenue_percent_change_month, num_orders_percent_change_month, num_visits_percent_change_month, num_new_consumers_percent_change_month])

        break
    }
  }

  useEffect(() => {
      getKPIValues()
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