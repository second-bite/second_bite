const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')
const { Info, DateTime } = require('luxon')

const {user_types_check, check_auth} = require('./user_auth')

// Allows the owner to retrieve all site visits for a specific restaurant
// NOTE: Business Owner View
router.get('/visits/:restaurant_id/:time_zone', check_auth(user_types_check.owner), async (req, res, next) => {
    try {
        let {restaurant_id, time_zone} = req.params
        restaurant_id = parseInt(restaurant_id)

        // Check if user's time zone is valid
        let is_time_zone_valid = false
        try {
            Intl.DateTimeFormat(undefined, { timeZone: time_zone });
            is_time_zone_valid = true;
        } catch (ex) {
            is_time_zone_valid = false;
        }
        if(!is_time_zone_valid) return next({status: 400, message: `Time Zone parameter is invalid`})

        // Retrieve the visists
        const visits = prisma.pageVisit.findMany({
            where: {restaurant_id: restaurant_id}
        })

        const visits_owner_time = visits.map((visit) => {
            const visit_utc_time = DateTime.fromJSDate(visit.visit_time, { zone: "utc" })
            const visit_owner_time = visit_utc_time.setZone(time_zone)
            const formatted_visit_owner_time = visit_owner_time.toFormat("cccc, LLLL dd yyyy, hh:mm a ZZZZ")
            const weekday = visit_owner_time.toFormat("ccc").toLowerCase() // 3-letter weekday
            return {
                ...visit,
                weekday: weekday,
                visit_time: formatted_visit_owner_time,
            }
        })

        res.status(200).send(orders_owner_time)
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
        console.log('PageVisit')
        const page_visit = await prisma.pageVisit.findFirst({
            where: {
                restaurant_id: restaurant_id,
                consumer_id: consumer_id,
            }
        })
        let is_first_visit = true
        if (page_visit) is_first_visit = false
        console.log('blah')

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
router.get('/orders/:restaurant_id/:time_zone', check_auth(user_types_check.owner), async (req, res, next) => {
    try {
        let {restaurant_id, time_zone} = req.params
        restaurant_id = parseInt(restaurant_id)

        // Check if user's time zone is valid
        let is_time_zone_valid = false
        try {
            Intl.DateTimeFormat(undefined, { timeZone: time_zone });
            is_time_zone_valid = true;
        } catch (ex) {
            is_time_zone_valid = false;
        }
        if(!is_time_zone_valid) return next({status: 400, message: `Time Zone parameter is invalid`})

        // Retrieve the orders
        const orders = prisma.order.findMany({
            where: {restaurant_id: restaurant_id}
        })

        const orders_owner_time = orders.map((order) => {
            const order_utc_time = DateTime.fromJSDate(order.order_time, { zone: "utc" })
            const order_owner_time = order_utc_time.setZone(time_zone)
            const formatted_order_owner_time = order_owner_time.toFormat("cccc, LLLL dd yyyy, hh:mm a ZZZZ")
            const weekday = order_owner_time.toFormat("ccc").toLowerCase() // 3-letter weekday
            return {
                ...order,
                weekday: weekday,
                order_time: formatted_order_owner_time,
            }
        })

        res.status(200).send(orders_owner_time)
    } catch (err) {
        next(err)
    }
})

module.exports = router