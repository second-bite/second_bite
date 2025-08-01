 import React, {useContext, useState, useEffect} from 'react'
 import { DateTime } from 'luxon'
 import { log_error } from "../../utils/utils";
 import { FadeLoader } from 'react-spinners'

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

    // enums
    const FORECAST_MODEL_TYPE = {
        LIN_REG: "Linear Regression",
        SARIMA: "SARIMA",
    }

    // State Variables
    const [kpi_titles, setKPITitles] = useState(["Revenue", "Orders", "Page Visits", "New Consumers"])
    const [kpi_percentages, setKPIPercentages] = useState(new Array(4).fill("0%"))
    const [kpi_price, setKPIPrice] = useState(new Array(4).fill("0"))
    const [forecast_model_type, SetForecastModelType] = useState(FORECAST_MODEL_TYPE.LIN_REG)
    const [is_kpi_loading, setIsKPILoading] = useState(false)

    // getPastKPIValues Helpers
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


  const getPastKPIValues = async (date_time_period_limit, date_time_prev_period_limit) => {
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

      // Isolate orders from the desired period
      const orders = await orders_response.json()
      const orders_owner_time = to_owner_time_zone(orders, "order_time", time_zone)
      const { curr_period_data: orders_curr_period, prev_period_data: orders_prev_period } = get_relevant_time_periods(orders_owner_time, "order_time", date_time_period_limit, date_time_prev_period_limit)
      setOrders(orders_curr_period)

      // Get site visits from the desired period
      const visits = await visits_response.json()
      const visits_owner_time = to_owner_time_zone(visits, "visit_time", time_zone)
      const { curr_period_data: visits_curr_period, prev_period_data: visits_prev_period } = get_relevant_time_periods(visits_owner_time, "visit_time", date_time_period_limit, date_time_prev_period_limit)
      setVisits(visits_curr_period)

      // Get total revenue & stats
      const revenue_curr_period = orders_curr_period.reduce((net_revenue, order) => net_revenue + Number(order.cost), 0)
      const revenue_prev_period = orders_prev_period.reduce((net_revenue, order) => net_revenue + order.cost, 0)
      let revenue_percent_change = percent_change(revenue_curr_period, revenue_prev_period)

      // Get total orders & stats 
      const num_orders_curr_period = orders_curr_period.length
      const num_orders_prev_period = orders_prev_period.length
      let num_orders_percent_change = percent_change(num_orders_curr_period, num_orders_prev_period)

      // Get total new consumers & stats 
      const first_time_orders_curr_period = orders_curr_period.filter((order) => order.is_first_order)
      const first_time_orders_prev_period = orders_prev_period.filter((order) => order.is_first_order)
      const num_new_consumers_curr_period = first_time_orders_curr_period.length
      const num_new_consumers_prev_period = first_time_orders_prev_period.length
      let num_new_consumers_percent_change = percent_change(num_new_consumers_curr_period, num_new_consumers_prev_period)

      // Get total visits & stats
      const num_visits_curr_period = visits_curr_period.length
      const num_visits_prev_period = visits_prev_period.length
      let num_visits_percent_change = percent_change(num_visits_curr_period, num_visits_prev_period)

      // Set State Variables
      setKPIPrice([currency_formatter.format(revenue_curr_period).toString(), num_orders_curr_period, num_visits_curr_period, num_new_consumers_curr_period])
      setKPIPercentages([revenue_percent_change, num_orders_percent_change, num_visits_percent_change, num_new_consumers_percent_change])
  }

  // NOTE: Gets KPI values (calls getPastKPIValues for past KPI values or uses linear regression for prediction)
  const getRegKPIValuesWrapper = async () => {
    const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    switch(kpi_time_range) {
        case KPI_TIME_RANGE.LAST_WEEK: 
            const date_time_one_week_ago = DateTime.now().minus({ weeks: 1 })
            const date_time_two_weeks_ago = DateTime.now().minus({ weeks: 2 })
            
            await getPastKPIValues(date_time_one_week_ago, date_time_two_weeks_ago)

            break
      case KPI_TIME_RANGE.LAST_MONTH:
          const date_time_one_month_ago  = DateTime.now().minus({ months: 1 })
          const date_time_two_months_ago = DateTime.now().minus({ months: 2 })

          await getPastKPIValues(date_time_one_month_ago, date_time_two_months_ago)
          break
      case KPI_TIME_RANGE.NEXT_WEEK:
          try {
              const response = await fetch(base_url + `/analytics/predict/${restaurant_id}/week`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({time_zone: time_zone}),
              })
              const err = new Error(`Status: ${response.status}. Failed to weekly prediction info from DB`)
              err.status = response.status
              if(!response.ok) throw err
              
              const {visits: predicted_visits_week, orders: predicted_orders_week, revenue: predicted_revenue_week, first_time_consumers: predicted_first_time_consumers_week} = await response.json()
              setKPIPrice([currency_formatter.format(predicted_revenue_week).toString(), predicted_orders_week, predicted_visits_week, predicted_first_time_consumers_week])
              setKPIPercentages(["-", "-", "-", "-"])
          } catch (err) {
              await log_error(err)
          }
          break
      case KPI_TIME_RANGE.NEXT_MONTH:
          try {
              const response = await fetch(base_url + `/analytics/predict/${restaurant_id}/month`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({time_zone: time_zone}),
              })

              const err = new Error(`Status: ${response.status}. Failed to monthly prediction info from DB`)
              err.status = response.status
              if(!response.ok) throw err

              const {visits: predicted_visits_month, orders: predicted_orders_month, revenue: predicted_revenue_month, first_time_consumers: predicted_first_time_consumers_month} = await response.json()
              setKPIPrice([currency_formatter.format(predicted_revenue_month).toString(), predicted_orders_month, predicted_visits_month, predicted_first_time_consumers_month])
              setKPIPercentages(["-", "-", "-", "-"])
          } catch (err) {
              await log_error(err)
          }
          break
    }
  }

  // NOTE: Gets KPI values for SARIMA forecasting
  const getSarimaKPIValues = async () => {
      let sarima_time_period = null
      if (kpi_time_range === KPI_TIME_RANGE.NEXT_WEEK) sarima_time_period = 'week'
      else sarima_time_period = 'month'
      try {
          setIsKPILoading(true)
          const response = await fetch(`/forecast/${restaurant_id}/${sarima_time_period}`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                  'Content-Type': 'application/json',
              },
          })
          if(!response.ok) {
              const err = new Error(`Status: ${response.status}. Failed to retrieve SARIMA forecast`)
              err.status = response.status
              throw err
          }
          const data = await response.json()
          setKPIPrice([currency_formatter.format(data.revenue).toString(), Math.floor(parseFloat(data.orders)), Math.floor(parseFloat(data.visits)), Math.floor(parseFloat(data.first_time_consumers))])
          setKPIPercentages(["-", "-", "-", "-"])
      } catch (err) {
          log_error(err)
      } finally {
          setIsKPILoading(false)
      }
  }

  useEffect(() => {
      if(kpi_time_range === KPI_TIME_RANGE.LAST_MONTH || kpi_time_range === KPI_TIME_RANGE.LAST_WEEK || forecast_model_type === FORECAST_MODEL_TYPE.LIN_REG) {
          getRegKPIValuesWrapper()
      }
      else {
          getSarimaKPIValues()
      }
  }, [restaurant_id, kpi_time_range, forecast_model_type])

  return (
    <section className="container mx-auto py-20 px-8">
      <div className="flex flex-row justify-between md:items-center">
        <div>
          <Typography className="font-bold">Overall Performance</Typography>
          <Typography
            variant="small"
            className="font-normal text-gray-600 md:w-full w-4/5"
          >
          </Typography>
        </div>
        {/* Model Selector */}
        {(kpi_time_range === KPI_TIME_RANGE.NEXT_WEEK || kpi_time_range === KPI_TIME_RANGE.NEXT_MONTH) ?
            <div className="shrink-0">
              <Menu>
                <MenuHandler>
                  <Button
                    color="gray"
                    variant="outlined"
                    className="flex items-center gap-1 !border-gray-300"
                  >
                    {forecast_model_type}
                    <ChevronDownIcon
                      strokeWidth={4}
                      className="w-3 h-3 text-gray-900"
                    />
                  </Button>
                </MenuHandler>
                <MenuList>
                  <MenuItem onClick={() => SetForecastModelType(FORECAST_MODEL_TYPE.LIN_REG)}>Linear Regression</MenuItem>
                  <MenuItem onClick={() => SetForecastModelType(FORECAST_MODEL_TYPE.SARIMA)}>SARIMA</MenuItem>
                </MenuList>
              </Menu>
            </div>
            : null
        }
        {/* KPI Time Range Selector */}      
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
              <MenuItem onClick={() => setKPITimeRange(KPI_TIME_RANGE.NEXT_WEEK)}>Next Week</MenuItem>
              <MenuItem onClick={() => setKPITimeRange(KPI_TIME_RANGE.NEXT_MONTH)}>Next Month</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
      <div className="flex justify-center w-full">
          {(is_kpi_loading) ?
              <section className="loading">
                  <FadeLoader />
              </section>
              :
              <div className="mt-6 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 items-center md:gap-2.5 gap-4 w-full">
                {kpi_titles.map((title, ind) => (
                  <KpiCard title={title} percentage={kpi_percentages[ind]} price={kpi_price[ind]} color={(kpi_percentages[ind].charAt(0) === '-') ? 'red' : 'green'} icon={(kpi_percentages[ind].charAt(0) === '-') ? (<ChevronDownIcon strokeWidth={4} className="w-3 h-3 text-red-500"/>) : (<ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500"/>) }/>
                ))}
              </div>
          }
      </div>
    </section>
  );
}

export default KpiCards;