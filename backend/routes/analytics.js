const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')
const { Info, DateTime } = require('luxon')

const {user_types_check, check_auth} = require('./user_auth')

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

// Allows the owner to retrieve the linear regression prediction for next week's orders, number of first time visitors, revenue, etc
// NOTE: Business Owner View
// TODO:
// Credit: https://www.ncl.ac.uk/webtemplate/ask-assets/external/maths-resources/statistics/regression-and-correlation/simple-linear-regression.html
const linear_regression = () => {

}
// TODO: 
// Performs data preprocessing -> condense data into only previous week's/month's data & remove outliers
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

const data_preprocessing = (data, prediction_target_type) => {

}

router.get('/predict/:restaurant_id/:time_period', check_auth(user_types_check.owner), async (req, res, next) => {
    try {
        let { restaurant_id, time_period } = req.params
        restaurant_id = parseInt(restaurant_id)

        // Check valid restaurant
        const restaurant = await prisma.restaurant.findUnique({
            where: {restaurant_id: restaurant_id}
        })
        if(!restaurant) return next({status: 400, message: `Restaurant does not exist`, error_source: 'backend', error_route: '/analytics/predict'})

        // Check valid prediction time period selection
        if (time_period !== TIME_PERIOD.WEEK || time_period !== TIME_PERIOD.MONTH) {
            return next({status: 400, message: `Invalid time period parameter`, error_source: 'backend', error_route: '/analytics/predict'})
        }

        // Get site visit data
        const visits = await prisma.pageVisit.findMany({
            where: {restaurant_id: restaurant_id},
            include: {
                consumer: true
            }
        })

        // Get order data
        const orders = await prisma.order.findMany({
            where: {restaurant_id: restaurant_id},
            include: {
                consumer: true
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
            }
        })

        // Perform data preprocessing
        const processed_visits = data_preprocessing(visits, PREDICTION_TARGET.VISIT, time_period)
        const processed_orders = data_preprocessing(orders, PREDICTION_TARGET.ORDER, time_period)
        const processed_revenue = data_preprocessing(orders, PREDICTION_TARGET.REVENUE, time_period)
        const processed_first_time_consumers = data_preprocessing(first_time_orders, PREDICTION_TARGET.FIRST_TIME_CONSUMER, time_period)

        // Perform prediction
        const predicted_visits = linear_regression(processed_visits, time_period)
        const predicted_orders = linear_regression(processed_orders, time_period)
        const predicted_revenue = linear_regression(processed_revenue, time_period)
        const predicted_first_time_consumers = linear_regression(processed_first_time_consumers, time_period)

        // Return Prediction
        res.status(200).json({visits: predicted_visits, orders: predicted_orders, revenue: predicted_revenue, first_time_consumers: predicted_first_time_consumers})

    } catch (err) {
        next(err)
    }
})

module.exports = router