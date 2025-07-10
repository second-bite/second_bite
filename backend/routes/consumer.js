const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')
const { DateTime } = require("luxon")

const {user_types, user_types_check, check_auth} = require('./user_auth')

// Used to retrieve currently logged in consumer's details
// NOTE: Consumer View
router.get('/', check_auth(user_types_check.consumer), async (req, res, next) => {
    try {
        const consumer_id = req.session.user_id
        const consumer = await prisma.consumer.findUnique({
            where: {consumer_id: consumer_id},
            include: {
                address: true,
                sent_friend_requests: true,
                received_friend_requests: true,
            }
        })

        if(!consumer) {
            return next({status: 404, message: "Consumer not found", error_source: 'backend', error_route: '/consumer'});
        }

        res.status(200).send(consumer)
    } catch (err) {
        next(err)
    }
})

// Used to edit consumer account details
// NOTE: Consumer View
router.patch('/', check_auth(user_types_check.consumer), async (req, res, next) => {
    try {
        const consumer_id = req.session.user_id

        if (!req.body) return next({status: 400, message: `Missing request body for account edit`, error_source: 'backend', error_route: '/consumer'})

        for(const required_field of user_types.consumer.required) {
            if(!req.body[required_field]) {
                return next({status: 400, message: `Missing required field ${required_field}`, error_source: 'backend', error_route: '/consumer'})
            }
        }

        // Enforce password security
        if(req.body.password.length < 8) {
            return next({status: 400, message: `Password must be at least 8 characters long.`, error_source: 'backend', error_route: '/consumer'})
        }

        // Check if username is already taken
        const username = req.body.username
        const existing_username_consumer = await prisma.consumer.findUnique({ where: {username: username} })
        if(existing_username_consumer && existing_username_consumer.consumer_id !== consumer_id) {
            return next({status: 400, message: `Username is already taken`, error_source: 'backend', error_route: '/consumer'})
        }

        console.log('Arrived here')

        // Hash the password before storing
        const hashed_pwd = await argon2.hash(req.body.password)

        // Create a new user in the database
        const data = {
            username,
            password: hashed_pwd,
            address: {
                update: {
                    street_address: req.body.street_address,
                    city: req.body.city,
                    state: req.body.state,
                    postal_code: req.body.postal_code,
                    country: req.body.country, 
                }
            }
        }

        const consumer = await prisma.consumer.update({
            where: { consumer_id: consumer_id },
            data: data,         
            include: {address: true}      
        })

        res.status(200).json({ id: consumer.consumer_id, username: consumer.username })
    } catch (err) {
        return next(err);
    }
})

// Used to add restaurant reservation (for currently logged in cosnumer)
// NOTE: Consumer View
router.post('/reserve/:restaurant_id/:time_zone', check_auth(user_types_check.consumer), async (req, res, next) => {
    let {restaurant_id, time_zone} = req.params
    restaurant_id = Number(restaurant_id)

    try {
        const consumer_id = req.session.user_id
        const consumer = await prisma.consumer.findUnique({
            where: {consumer_id: consumer_id},
        })

        // Check if user's time zone is valid
        let is_time_zone_valid = false
        try {
            Intl.DateTimeFormat(undefined, { timeZone: time_zone });
            is_time_zone_valid = true;
        } catch (ex) {
            is_time_zone_valid = false;
        }
        if(!is_time_zone_valid) return next({status: 400, message: `Time Zone parameter is invalid`})

        // Get the current time in time zone
        const date_time_now_in_zone = DateTime.now().setZone(time_zone)

        // Check user hasn't already reserved restaurant
        if(consumer.reserved_restaurant_id) {
            // Get reservation expiration
            const parsed_reservation_expiration = DateTime.fromJSDate(consumer.reservation_expiration, { zone: "utc" })
            const reservation_expiration_in_zone = parsed_reservation_expiration.setZone(time_zone)
            if(consumer.reserved_restaurant_id && (date_time_now_in_zone.toMillis() < reservation_expiration_in_zone.toMillis())) return next({status: 409, message: `Already reserved a restaurant today. Existing reservation lasts from ${date_time_now_in_zone.toFormat("cccc, LLLL dd yyyy, hh:mm a ZZZZ")} to ${reservation_expiration_in_zone.toFormat("cccc, LLLL dd yyyy, hh:mm a ZZZZ")}`, error_source: 'backend', error_route: '/consumer/reserve'})
        }

        // Get restaurant to be reserved
        const restaurant = await prisma.restaurant.findUnique({
            where: {restaurant_id: restaurant_id},
        })
        if(!restaurant) return next({status: 400, message: `Restaurant no longer exists`, error_source: 'backend', error_route: '/consumer/reserve'})

        let day_ind = date_time_now_in_zone.toJSDate().getDay()
        const closing_time_str = restaurant.pickup_time[day_ind]

        // Function used to find next closing time if restaurant is closed today or pickup time has already passed
        const findNextClosingTime = () => {
            let next_open_day_ind
            let days_to_add = 0
            for(let i = (day_ind + 1) % 7; i != day_ind; i = (i + 1) % 7) {
                days_to_add++
                if(restaurant.pickup_time[i] !== 'N/A') {
                    next_open_day_ind = i
                    break
                }
                if(days_to_add === 7) throw new Error('Restaurant is always closed')
            }
            const next_closing_time_str = restaurant.pickup_time[next_open_day_ind]
            let [closing_hour, closing_minute] = next_closing_time_str.split(":")
            closing_hour = Number(closing_hour)
            closing_minute = Number(closing_minute) 
            let next_closing_time_in_zone = date_time_now_in_zone.plus({ days: days_to_add }).set({
                hour: closing_hour,
                minute: closing_minute,
                second: 0,
                millisecond: 0
            })
            return next_closing_time_in_zone.toFormat("cccc, LLLL dd yyyy, hh:mm a ZZZZ")
        }

        // Check that store isn't closed
        if(closing_time_str === 'N/A') {
            try {
                const next_closing_time_formatted_str = findNextClosingTime()
                return next({status: 409, message: `Restaurant is closed today. Next open: ${next_closing_time_formatted_str}`, error_source: 'backend', error_route: '/consumer/reserve'})
            } catch(err) {
                return next({status: 409, message: `Restaurant is always closed`, error_source: 'backend', error_route: '/consumer/reserve'})
            }
        }

        // Parse out closing time
        let [closing_hour, closing_minute] = closing_time_str.split(":")
        closing_hour = Number(closing_hour)
        closing_minute = Number(closing_minute) 
        let closing_time_in_zone = date_time_now_in_zone.set({
            hour: closing_hour,
            minute: closing_minute,
            second: 0,
            millisecond: 0
        })

        if(closing_time_in_zone.toMillis() < date_time_now_in_zone.toMillis()) { 
            try { 
                const next_closing_time_formatted_str = findNextClosingTime()
                return next({status: 409, message: `Restaurant pickup time has already passed. Next open: ${next_closing_time_formatted_str}`, error_source: 'backend', error_route: '/consumer/reserve'})
            } catch(err) {
                return next({status: 409, message: `Restaurant is always closed`, error_source: 'backend', error_route: '/consumer/reserve'})
            }
        }

        // Add reservation
        const updated_consumer = await prisma.consumer.update({
            where: {consumer_id: consumer_id},
            data: {
                reserved_restaurant_id: restaurant_id,
                reservation_expiration: closing_time_in_zone.toJSDate(),
            }
        })

        res.status(200).json({username: updated_consumer.username, reservation_expiration: updated_consumer.reservation_expiration})
    } catch (err) {
        next(err)
    }
})

/**
 * Friend Feature
 */
// Used to get list of consumers (possibly on an Add Friend Search feature?)
// NOTE: Consumer View
router.get('/all_other', check_auth(user_types_check.consumer), async (req, res, next) => {
    const consumer_id = req.session.user_id

    const FRIEND_STATUS = {
        FRIEND: 'friend',
        SENT_FRIEND_REQ: 'sent_friend_req', // consumer has sent request to other
        RECEIVED_FRIEND_REQ: 'received_friend_req', // consumer has received friend request from other
        NONE: 'none',
    }

    try {
        // Store all of a users friends in a hashset for efficiency
        const friends_ids_set = new Set()
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    {consumer_id_a: consumer_id},
                    {consumer_id_b: consumer_id},
                ]
            },
            include: {
                friend_a: true,
                friend_b: true,
            }
        })
        for(const friendship of friendships) {
            if (friendship.consumer_id_a === consumer_id) friends_ids_set.add(friendship.consumer_id_b)
            else if (friendship.consumer_id_b === consumer_id) friends_ids_set.add(friendship.consumer_id_a)
        }

        // Store sent friend requests in a hashset for efficiency
        const consumer = await prisma.consumer.findUnique({
            where: {consumer_id: consumer_id},
            include: {
                sent_friend_requests: true,
                received_friend_requests: true,
            }
        })
        const sent_friend_request_ids_set = new Set() // Set of consumers that the currently logged in consumer has sent friend requests to
        if(consumer.sent_friend_requests) {
            for(const sent_friend_request of consumer.sent_friend_requests) {
                sent_friend_request_ids_set.add(sent_friend_request.receiver_consumer_id)
            }
        }
        const received_friend_requests_ids_set = new Set() // Set of consumers that the currently logged in consumer has received friend requests from
        if(consumer.received_friend_requests) {
            for(const received_friend_request of consumer.received_friend_requests) {
                received_friend_requests_ids_set.add(received_friend_request.sender_consumer_id)
            }
        }

        // Finds all consumers minus the current consumer
        const other_consumers = await prisma.consumer.findMany({
            where: {
                consumer_id: {
                    not: consumer_id,
                }
            },
            include: {
                address: true,
                friendships_a: true,
                friendships_b: true,
                sent_friend_requests: true,
                received_friend_requests: true,
            }
        })

        const other_consumers_updated = other_consumers.map((consumer) => ({
            ...consumer,
            friend_status: (friends_ids_set.has(consumer.consumer_id)) ? 
                            (FRIEND_STATUS.FRIEND) : 
                            (sent_friend_request_ids_set.has(consumer.consumer_id)) ?
                                (FRIEND_STATUS.SENT_FRIEND_REQ) :
                                (received_friend_requests_ids_set.has(consumer.consumer_id)) ?
                                    (FRIEND_STATUS.RECEIVED_FRIEND_REQ) :
                                    (FRIEND_STATUS.NONE),
        }))

        res.status(200).json(other_consumers_updated)
    } catch (err) {
        next(err)
    }
    
})

// Used to get list of consumer's current friends
router.get('/friend/all', check_auth(user_types_check.consumer), async (req, res, next) => {
    const consumer_id = req.session.user_id

    try {
        const friends_ids_set = new Set()
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    {consumer_id_a: consumer_id},
                    {consumer_id_b: consumer_id},
                ]
            },
            include: {
                friend_a: true,
                friend_b: true,
            }
        })
        for(const friendship of friendships) {
            if (friendship.consumer_id_a === consumer_id) friends_ids_set.add(friendship.consumer_id_b)
            else if (friendship.consumer_id_b === consumer_id) friends_ids_set.add(friendship.consumer_id_a)
        }

        const friends_ids_arr = Array.from(friends_ids_set)
        const friends = await prisma.consumer.findMany({
            where: {
                consumer_id: {
                    in: friends_ids_arr
                }
            }
        })

        res.status(200).json(friends)
    } catch (err) {
        next(err)
    }
    
})

// Used to create a new friend request
// NOTE: Consumer View
router.post('/friend/friend_req/:receiving_consumer_id', check_auth(user_types_check.consumer), async (req, res, next) => {
    const consumer_id = req.session.user_id
    try{
        let { receiving_consumer_id } = req.params
        receiving_consumer_id = parseInt(receiving_consumer_id)

        // Check that this doesn't conflict with existing friend request
        const existing_friend_request = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    {sender_consumer_id: consumer_id, receiver_consumer_id: receiving_consumer_id},
                    {receiver_consumer_id: consumer_id, sender_consumer_id: receiving_consumer_id},
                ]
            }
        })
        if(existing_friend_request) return next({status: 400, message: `Friend request with these participants already exists`, error_source: 'backend', error_route: '/consumer/friend/friend_req'})
        
        // Check that these users aren't already friends
        const existing_friendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    {consumer_id_a: consumer_id, consumer_id_b: receiving_consumer_id},
                    {consumer_id_b: consumer_id, consumer_id_a: receiving_consumer_id},
                ]
            }
        })
        if(existing_friendship) return next({status: 400, message: `These participatns are already friends`, error_source: 'backend', error_route: '/consumer/friend/friend_req'})

        const data = {
            sender_consumer_id: consumer_id,
            receiver_consumer_id: receiving_consumer_id,
        }

        const new_friend_request = await prisma.friendRequest.create({
            data: data
        })

        res.status(201).json(new_friend_request)
    } catch (err) {
        next(err)
    }
})

// Used to accept a friend request
// NOTE: Consumer View
router.post('/friend/accept/:sender_consumer_id', check_auth(user_types_check.consumer), async (req, res, next) => {
    const consumer_id = req.session.user_id
    try {
        let { sender_consumer_id } = req.params
        sender_consumer_id = parseInt(sender_consumer_id)
        const deleted_friend_request = await prisma.friendRequest.deleteMany({
            where: {
                OR: [
                    {sender_consumer_id: consumer_id, receiver_consumer_id: sender_consumer_id},
                    {receiver_consumer_id: consumer_id, sender_consumer_id: sender_consumer_id},
                ]
            }
        })

        const data = {
            consumer_id_a: consumer_id,
            consumer_id_b: sender_consumer_id,
        }

        const created_friendship = await prisma.friendship.create({
            data: data
        })

        res.status(201).json(created_friendship)
    } catch (err) {
        next(err)
    }
})

// Used to delete a friend request
// NOTE: Consumer View
router.post('/friend/reject/:sender_consumer_id', check_auth(user_types_check.consumer), async (req, res, next) => {
    const consumer_id = req.session.user_id
    try{
        let { sender_consumer_id } = req.params
        sender_consumer_id = parseInt(sender_consumer_id)

        const deleted_friend_request = await prisma.friendRequest.deleteMany({
            where: {
                OR: [
                    {sender_consumer_id: consumer_id, receiver_consumer_id: sender_consumer_id},
                    {receiver_consumer_id: consumer_id, sender_consumer_id: sender_consumer_id},
                ]
            }
        })

        res.status(200).json(deleted_friend_request)
    } catch (err) {
        next(err)
    }
})

module.exports = router