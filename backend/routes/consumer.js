const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')

const {user_types_check, check_auth} = require('./user_auth')

// Used to retrieve currently logged in consumer's details
// NOTE: Consumer View
router.get('/', check_auth(user_types_check.consumer), async (req, res, next) => {
    try {
        const consumer_id = req.session.user_id
        const consumer = await prisma.consumer.findUnique({
            where: {consumer_id: consumer_id},
            include: {
                address: true,
            }
        })

        if(!consumer) {
            return next({status: 404, message: "Consumer not found", error_source: 'backend', error_route: '/consumer'});
        }

        // const {password, ...visible_owner_info} = owner
        // res.status(200).send(visible_owner_info)
        res.status(200).send(consumer)
    } catch (err) {
        next(err)
    }
})

// Used to add restaurant reservation (for currently logged in cosnumer)
// NOTE: Consumer View
router.post('/reserve/:restaurant_id', check_auth(user_types_check.consumer), async (req, res, next) => {
    let {restaurant_id} = req.params
    restaurant_id = Number(restaurant_id)

    try {
        const consumer_id = req.session.user_id
        const consumer = await prisma.consumer.findUnique({
            where: {consumer_id: consumer_id},
        })

        // Check user hasn't already reserved restaurant
        const date_time_now = new Date()
        if(consumer.reserved_restaurant_id && (date_time_now < consumer.reservation_expiration)) return next({status: 409, message: `Already reserved a restaurant today`, error_source: 'backend', error_route: '/consumer/reserve'})

        // Get restaurant to be reserved
        const restaurant = await prisma.restaurant.findUnique({
            where: {restaurant_id: restaurant_id},
        })
        if(!restaurant) return next({status: 400, message: `Restaurant no longer exists`, error_source: 'backend', error_route: '/consumer/reserve'})

        let day_ind = date_time_now.getDay()
        const closing_time_str = restaurant.pickup_time[day_ind]

        // Check that store isn't closed
        if(closing_time_str === 'N/A') return next({status: 409, message: `Restaurant is closed today`, error_source: 'backend', error_route: '/consumer/reserve'})

        // Parse out closing time
        const time_regex = /^(\d{1,2}):(\d{2})(AM|PM)$/i
        const parsed_time = closing_time_str.match(time_regex)
        const is_am = parsed_time[3] === 'AM' || parsed_time[3] === 'am'
        const closing_hour = is_am ? Number(parsed_time[1]) : Number(parsed_time[1]) + 12 
        const closing_minute = Number(parsed_time[2]) // TODO: 
        let closing_time = new Date()
        closing_time.setHours(closing_hour, closing_minute)
        if(closing_time < date_time_now) return next({status: 409, message: `Restaurant pickup time has already passed`, error_source: 'backend', error_route: '/consumer/reserve'})

        // Add reservation
        const updated_consumer = await prisma.consumer.update({
            where: {consumer_id: consumer_id},
            data: {
                reserved_restaurant_id: restaurant_id,
                reservation_expiration: closing_time,
            }
        })

        res.status(200).json({username: updated_consumer.username, reservation_expiration: updated_consumer.reservation_expiration})
    } catch (err) {
        next(err)
    }
})

/**
 * Edit Account Details
 */
// Used to edit account details
// TODO:
// NOTE: Consumer View
// router.patch('/consumer/:id', (req, res) => {
//     const {consumer_id} = req.params
//     const {...} = req.body // TODO: Add defaault empty values here (to isolate what changed)
// })

// Used to delete account
// TODO:
// NOTE: Consumer View
// router.delete('/consumer', (req, res) => {

// })

/**
 * Friend Feature
 */
// TODO: 
// Used to get list of consumers (possibly on an Add Friend Search feature?)
// NOTE: Consumer View
// router.get('/consumer/all', (req, res) => {
//     const {...} = req.query
// })

module.exports = router