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
const linear_regression = () => {

}

const data_preprocessing = () => {
    
}

router.get('/predict/:restaurant_id', check_auth(user_types_check.owner), async (req, res, next) => {
    try {
        let { restaurant_id } = req.params
        restaurant_id = parseInt(restaurant_id)

    } catch (err) {
        next(err)
    }
})

module.exports = router