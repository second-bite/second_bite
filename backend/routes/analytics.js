const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')
const { Info, DateTime } = require('luxon')

const {user_types_check, check_auth} = require('./user_auth')

// Enums relevant for prediction
const PREDICTION_TARGET = {
    ORDER: "order",
    FIRST_TIME_CONSUMER: "first_time_consumer",
    VISIT: "visit",
    REVENUE: "revenue",
}
const TIME_PERIOD = {
    WEEK: "week",
    MONTH: "month",
}

// Allows the owner to retrieve all site visits for a specific restaurant
// NOTE: Business Owner View
router.get('/visits/:restaurant_id', check_auth(user_types_check.owner), async (req, res, next) => {
    try {
        let {restaurant_id} = req.params
        restaurant_id = parseInt(restaurant_id)

        // Retrieve the visists
        const visits = await prisma.pageVisit.findMany({
            where: {restaurant_id: restaurant_id},
            include: {
                consumer: true
            }
        })

        res.status(200).send(visits)
    } catch (err) {
        next(err)
    }
})

// Allows the consumer to add a page visit to a specific restaurant
// NOTE: Consumer View
router.post('/visit/:restaurant_id', check_auth(user_types_check.consumer), async (req, res, next) => {
    const consumer_id = req.session.user_id
    let {restaurant_id} = req.params
    restaurant_id = parseInt(restaurant_id)
    try {
        // Check valid restaurant
        const restaurant = await prisma.restaurant.findUnique({
            where: {restaurant_id: restaurant_id}
        })
        if(!restaurant) return next({status: 400, message: `Restaurant does not exist`, error_source: 'backend', error_route: '/analytics/visits'})

        // Find if it's a consumer's first visit page visit for a specific restaurant
        const page_visit = await prisma.pageVisit.findFirst({
            where: {
                restaurant_id: restaurant_id,
                consumer_id: consumer_id,
            }
        })
        let is_first_visit = true
        if (page_visit) is_first_visit = false

        const data = {
            is_first_visit: is_first_visit,
            restaurant_id: restaurant_id,
            consumer_id: consumer_id,
        }

        const visit = await prisma.pageVisit.create({
            data: data
        })

        res.status(201).send(visit)
    } catch (err) {
        next(err)
    }
})

// Allows the owner to retrieve all restaurant orders for a specific restaurant
// NOTE: Business Owner View
router.get('/orders/:restaurant_id', check_auth(user_types_check.owner), async (req, res, next) => {
    try {
        let {restaurant_id} = req.params
        restaurant_id = parseInt(restaurant_id)

        // Check valid restaurant
        const restaurant = await prisma.restaurant.findUnique({
            where: {restaurant_id: restaurant_id}
        })
        if(!restaurant) return next({status: 400, message: `Restaurant does not exist`, error_source: 'backend', error_route: '/analytics/orders'})

        // Retrieve the orders
        const orders = await prisma.order.findMany({
            where: {restaurant_id: restaurant_id},
            include: {
                consumer: true
            }
        })

        res.status(200).send(orders)
    } catch (err) {
        next(err)
    }
})

// Performs the linear regression operation
// Credit: https://www.ncl.ac.uk/webtemplate/ask-assets/external/maths-resources/statistics/regression-and-correlation/simple-linear-regression.html
const linear_regression = (processed_data) => {
    const num_entries = processed_data.length

    let sum_day_ind = 0, sum_value = 0
    for(const [day_ind, val] of processed_data) {
        sum_day_ind += day_ind
        sum_value += val
    }

    const day_ind_mean = sum_day_ind / num_entries
    const value_mean = sum_value / num_entries

    let covariance = 0
    let variance = 0
    for(const [day_ind, val] of processed_data) {
        covariance += (day_ind - day_ind_mean) * (val - value_mean)
        variance +=  (day_ind - day_ind_mean) ** 2
    }

    let slope = covariance / variance

    let y_intercept = value_mean - slope * day_ind_mean

    return { slope, y_intercept }
    
}


// Performs the predictions using the linear regression
const linear_regression_prediction = (processed_data, num_forecast_days) => {
    const { slope, y_intercept } = linear_regression(processed_data)

    // TODO: Find start index for prediction & then just add from there
    let pred_x_value = processed_data[processed_data.length - 1][0] + 1

    let prediction_total_value = 0

    for(let i = 0; i < num_forecast_days; i++) {
        prediction_total_value += pred_x_value * slope + y_intercept
        pred_x_value++
    }

    return prediction_total_value
}


// Performs data preprocessing -> condense data into only previous week's/month's data & remove outliers
const data_preprocessing = (data, prediction_target_type, time_period, time_var, time_zone) => {

    // Filter out to fit into desired time period
    const now = DateTime.now().setZone(time_zone).startOf('day')
    const date_window_start = (time_period === TIME_PERIOD.WEEK) ? now.minus({weeks: 1}) : now.minus({months: 1})
    const date_filtered_data =  data.filter(entry => {
        const luxon_entry_date = DateTime.fromJSDate(entry[time_var], { zone: "utc" }).setZone(time_zone).startOf('day')
        return ((luxon_entry_date  > date_window_start) && (luxon_entry_date <= now))
    })

    // Date to Day Ind Mapping (for easy integer x-axis in regression)
    const date_to_day_ind = new Map()
    let temp = date_window_start
    let day_ind = 0
    while(temp <= now) {
        date_to_day_ind.set(temp.toISODate(), day_ind++)
        temp = temp.plus({days: 1})
    }

    // Initialize nx2 arrays (to 0s)
    // - Rows are discrete entries
    // - Column 0 is day ind (int representing date)
    // - Column 1 is numerical figure (e.g. revenue, num_orders, etc)
    // NOTE: This zero-fills in any data gaps over the analyzed window
    let isolated_arr = Array.from(date_to_day_ind).map(([_, day_ind]) => [day_ind, 0])

    // Aggregate data per day
    let aggregated = null
    if([PREDICTION_TARGET.FIRST_TIME_CONSUMER, PREDICTION_TARGET.ORDER, PREDICTION_TARGET.REVENUE].includes(prediction_target_type)) {
        aggregated = date_filtered_data.reduce((accumulator, entry) => {
            const formatted_date = DateTime.fromJSDate(entry[time_var], { zone: "utc" }).setZone(time_zone).startOf('day').toISODate()
            if(accumulator[formatted_date] !== undefined) {
                accumulator[formatted_date] += (prediction_target_type === PREDICTION_TARGET.REVENUE) ? Number(entry.cost) : 1
            } else { // First time encountering this date
                accumulator[formatted_date] =  (prediction_target_type === PREDICTION_TARGET.REVENUE) ? Number(entry.cost) : 1
            }
            return accumulator
        }, {})
    }
    else {
        aggregated = date_filtered_data.reduce((accumulator, entry) => {
            const formatted_date = DateTime.fromJSDate(entry[time_var], { zone: "utc" }).setZone(time_zone).startOf('day').toISODate()
            if(accumulator[formatted_date] !== undefined) {
                accumulator[formatted_date] += 1
            } else { // First time encountering this date
                accumulator[formatted_date] =  1
            }
            return accumulator
        }, {})
    }

    // Fill in nx2 arrays using data
    const aggregated_entries = Object.entries(aggregated)
    for(const entry of aggregated_entries) {
        if(entry[1] > 0) {
            const date = entry[0]
            const day_ind = date_to_day_ind.get(date)
            isolated_arr[day_ind][1] = entry[1]
        }
    }

    console.log(isolated_arr)

    // Add num days of forecast (7 for week, 30/31 for month) to ease linear regression prediction
    const date_forecast_end = (time_period === TIME_PERIOD.WEEK) ? now.plus({weeks: 1}) : now.plus({months: 1})
    const num_forecast_days = Math.ceil(date_forecast_end.diff(now, 'days').days)
    return {isolated_arr, num_forecast_days}
}


// Allows the owner to retrieve the linear regression prediction for next week's orders, number of first time visitors, revenue, etc
// NOTE: Business Owner View
router.post('/predict/:restaurant_id/:time_period', check_auth(user_types_check.owner), async (req, res, next) => {
    try {
        let { restaurant_id, time_period } = req.params
        restaurant_id = parseInt(restaurant_id)
        const { time_zone } = req.body

        // Check valid restaurant
        const restaurant = await prisma.restaurant.findUnique({
            where: {restaurant_id: restaurant_id}
        })
        if(!restaurant) return next({status: 400, message: `Restaurant does not exist`, error_source: 'backend', error_route: '/analytics/predict'})

        // Check valid prediction time period selection
        if (time_period !== TIME_PERIOD.WEEK && time_period !== TIME_PERIOD.MONTH) {
            return next({status: 400, message: `Invalid time period parameter`, error_source: 'backend', error_route: '/analytics/predict'})
        }

        // Check valid time zone
        const time_zone_validity = DateTime.local().setZone(time_zone)
        if(!time_zone_validity.isValid) return next({status: 400, message: `Invalid time zone in req.body`, error_source: 'backend', error_route: '/analytics/predict'})

        // Get site visit data
        const visits = await prisma.pageVisit.findMany({
            where: {restaurant_id: restaurant_id},
            include: {
                consumer: true
            },
            orderBy: {
                visit_time: 'asc'
            }
        })

        // Get order data
        const orders = await prisma.order.findMany({
            where: {restaurant_id: restaurant_id},
            include: {
                consumer: true
            },
            orderBy: {
                order_time: 'asc'
            }
        })

        // Get first time consumer data (NOTE: first time consumer <==> first time order)
        const first_time_orders = await prisma.order.findMany({
            where: {
                restaurant_id: restaurant_id,
                is_first_order: true,
            },
            include: {
                consumer: true
            },
            orderBy: {
                order_time: 'asc'
            }
        })

        // Perform data preprocessing & predictions
        let num_forecast_days = null
        let processed_visits = null, processed_orders = null, processed_revenue = null, processed_first_time_consumers = null;
        ({ isolated_arr: processed_visits, num_forecast_days} = data_preprocessing(visits, PREDICTION_TARGET.VISIT, time_period, "visit_time", time_zone));
        const predicted_visits = linear_regression_prediction(processed_visits, num_forecast_days);
        ({isolated_arr: processed_orders, num_forecast_days} = data_preprocessing(orders, PREDICTION_TARGET.ORDER, time_period, "order_time", time_zone));
        const predicted_orders = linear_regression_prediction(processed_orders, num_forecast_days);
        ({isolated_arr: processed_revenue, num_forecast_days} = data_preprocessing(orders, PREDICTION_TARGET.REVENUE, time_period, "order_time", time_zone));
        const predicted_revenue = linear_regression_prediction(processed_revenue, num_forecast_days);
        ({isolated_arr: processed_first_time_consumers, num_forecast_days} = data_preprocessing(first_time_orders, PREDICTION_TARGET.FIRST_TIME_CONSUMER, time_period, "order_time", time_zone));
        const predicted_first_time_consumers = linear_regression_prediction(processed_first_time_consumers, num_forecast_days);      

        // Return Prediction
        res.status(200).json({visits: Math.round(predicted_visits), orders: Math.round(predicted_orders), revenue: predicted_revenue, first_time_consumers: Math.round(predicted_first_time_consumers)})

    } catch (err) {
        next(err)
    }
})

module.exports = router