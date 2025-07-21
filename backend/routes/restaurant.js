const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')

const {user_types_check, check_auth} = require('./user_auth')

/**
 * Utilities
 */
// Used to modularize process of adding rating and distance fields when retrieving restaurants
// NOTE: Closure idea borrowed from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
const add_rating_distance_n_favorite_wrapper = (restaurants, is_full_address_provided, street_address, city, postal_code, state, country) => {
    return async function add_rating_distance_n_favorite(req, res, next) {
        // Add ratings field
        const ratings_per_restaurant = await prisma.rating.groupBy({
            by: ['restaurant_id'],
            _avg: {
                num_stars: true,
            }
        })
        const restaurant_to_avg_rating = new Map(
            ratings_per_restaurant.map((entry) => ([
                entry.restaurant_id,
                entry._avg.num_stars,
            ]))
        )
        restaurants = restaurants.map((restaurant) => ({
            ...restaurant,
            avg_rating: restaurant_to_avg_rating.has(restaurant.restaurant_id) ? restaurant_to_avg_rating.get(restaurant.restaurant_id) : -1,
        }))


        // Add distance field
        if(is_full_address_provided) {
            const api_key = process.env.GOOGLE_MAPS_API_KEY
            const origin = encodeURIComponent(`${street_address}, ${city}, ${state} ${postal_code}`)
            const destinations = restaurants.map((restaurant) => {
                const a = restaurant.address
                return (encodeURIComponent(`${a.street_address}, ${a.city}, ${a.state} ${a.postal_code}`))
            }).join('|')
            // NOTE: units only seems to apply to distance.text, not value (which is fine for my use case)
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json`+ `?origins=${origin}&destinations=${destinations}&units=imperial&key=${api_key}`
            const response = await fetch(url)
            if (!response.ok) return next({status: response.status, message: "Google Maps Distance Matrix API call failed"})
            const res_json = await response.json();
            const row = res_json.rows[0]
            restaurants = restaurants.map((restaurant, ind) => ({
                ...restaurant, 
                distance_text: row.elements[ind].distance.text,
                distance_value: row.elements[ind].distance.value,
            }))
        } else {
            restaurants = restaurants.map((restaurant) => ({
                ...restaurant,
                distance_text: null,
                distance_value: null,
            }))
        }

        // Retrieve favorited status
        const consumer_id = req.session.user_id
        const favorite_relations = await prisma.favorite.findMany({
            where: {
                consumer_id: {
                    equals: consumer_id
                }
            }
        })
        const id_to_favorite_status = new Map()
        for (const favorite_relation of favorite_relations) {
            id_to_favorite_status.set(favorite_relation.restaurant_id, favorite_relation.is_favorited)
        }

        // Add favorited status to restaurants
        let is_missing_favorite_status = false
        restaurants = restaurants.map((restaurant) => {
            if(!id_to_favorite_status.has(restaurant.restaurant_id)) {
                is_missing_favorite_status = true
            }

            return {
                ...restaurant,
                is_favorited:  id_to_favorite_status.get(restaurant.restaurant_id),
            }
        })
        if (is_missing_favorite_status) {
            return next({status: 500, message: "Failed to retrieve favorited status for restaurant", error_source: 'backend', error_route: '/restaurant'})
        }

        return restaurants
    }
}


/** 
 * Fundamental Operations
 */

// Get list of all restaurants (w/ desired filters, etc - used for Main Search Page)
// NOTE: Consumer View
router.get('/', check_auth(user_types_check.consumer), async (req, res, next) => {
    const {search_query, street_address, city, postal_code, state, country} = req.query

    // If an address field is provided, all must be provided
    const is_address_provided = [street_address, city, postal_code, state, country].some(elem => elem)
    const is_full_address_provided = [street_address, city, postal_code, state, country].every(elem => elem)
    if(is_address_provided && !is_full_address_provided) return next({status: 400, message: 'Missing some address fields',  error_source: 'backend', error_route: '/restaurant'})
    
    let filters = {}
    try {
        filters.include = { address: true, ratings: true }
        filters.take = 25 // Ideally helps reduce exhaustion & allows request batching of Google Maps Distance Matrix API
        
        if(search_query?.trim()) {
            filters.where = {}
            filters.where.name = {
                contains: search_query,
                mode: 'insensitive',
            }
        }

        let restaurants = await prisma.restaurant.findMany(filters)

        // Add ratings & distance fields if possible
        const add_rating_distance_n_favorite = add_rating_distance_n_favorite_wrapper(restaurants, is_full_address_provided, street_address, city, postal_code, state, country)
        restaurants = await add_rating_distance_n_favorite(req, res, next)

        res.status(200).json(restaurants)
    } catch (err) {
        return next(err)
    }
})

// Create new restaurant entry
// NOTE: Business Owner View
router.post('/', check_auth(user_types_check.owner),  async (req, res, next) => {
    try {
        const owner_id = req.session.user_id
        if (!req.body) return next({status: 400, message: `Missing request body for account register`, error_source: 'backend', error_route: '/restaurant'})

        const required_fields = [`name`, `descr`, `address`, `categories`, `img_url`, `img_alt`, `avg_cost`, `pickup_time`, `time_zone`]
        const required_address_fields = [`street_address`, `city`, `postal_code`, `state`, `country`]
        for(const required_field of required_fields) {
            if(!req.body[required_field]) {
                return next({status: 400, message: `Missing required field ${required_field}`, error_source: 'backend', error_route: '/restaurant'})
            }
        }
        for(const required_address_field of required_address_fields) {
            if(!req.body.address[required_address_field]) {
                return next({status: 400, message: `Missing required address field ${required_address_field}`, error_source: 'backend', error_route: '/restaurant'})
            }
        }

        const data = {
            name:  req.body.name,
            descr: req.body.descr,
            address: {
                create: {
                    street_address: req.body.address.street_address,
                    city: req.body.address.city,
                    state: req.body.address.state,
                    postal_code: req.body.address.postal_code,
                    country: req.body.address.country, 
                }
            },
            categories: req.body.categories,
            img_url: req.body.img_url,
            img_alt: req.body.img_alt,
            avg_cost: req.body.avg_cost,
            pickup_time: req.body.pickup_time,
            time_zone: req.body.time_zone,
            owner_id: owner_id,
        }
        const restaurant = await prisma.restaurant.create({
            data: data,            
        })

        const { restaurant_id: restaurant_id_, address_id: address_id_, owner_id: owner_id_, ...public_response} = restaurant
        res.status(201).json( public_response )
    } catch (err) {
        return next(err)
    }
})


// Delete existing restaurant entry
// NOTE: Business Owner View
router.delete('/:restaurant_id', check_auth(user_types_check.owner), async (req, res, next) => {
    try {
        let {restaurant_id} = req.params
        id = parseInt(restaurant_id)
        const deleted_restaurant = await prisma.restaurant.delete({
            where: {restaurant_id: restaurant_id}
        })

        const {restaurant_id_, owner_id, ...visible_deleted_restaurant} = deleted_restaurant
        res.status(200).send(visible_deleted_restaurant)
    } catch (err) {
        return next(err)
    }
})

/**
 * Ratings/Reviews
 */
// Rate restaurant
// NOTE: Consumer View
router.post('/rating/:restaurant_id', check_auth(user_types_check.consumer), async (req, res, next) => {
    const {restaurant_id} = req.params
    const consumer_id = req.session.user_id

    if(!req.body) return next({status: 400, message: `Missing request body for account edit`, error_source: 'backend', error_route: '/restaurant/rating'})

    // Check for required req.body fields
    const { msg = null, num_stars } = req.body

    if(!num_stars) return next({status: 400, message: `Request body is missing required field num_stars`, error_source: 'backend', error_route: '/restaurant/rating'})

    try{
        const user = await prisma.rating.findFirst({ where: {consumer_id: consumer_id, restaurant_id: Number(restaurant_id)} })
        if(user) return next({status: 403, message: `User has already left review on this restaurant`, error_source: 'backend', error_route: '/restaurant/rating'})

        // Add new rating
        const data = {
            num_stars: num_stars,
            consumer_id: consumer_id,
            restaurant_id: Number(restaurant_id),
            msg: msg,
        }

        const new_rating = await prisma.rating.create({
            data: data,
        })

        return res.status(201).json({num_stars: new_rating.num_stars, msg: new_rating.msg})
    } catch (err) {
        return next(err)
    }
})

/**
 * Recommendation
 */
// Used to get the restaurants from a consumer's page visits
// NOTE: Consumer View
router.get('/visit/:consumer_id', check_auth(user_types_check.consumer), async (req, res, next) => {
    let {consumer_id} = req.params
    consumer_id = parseInt(consumer_id)

    const {street_address, city, postal_code, state, country} = req.query

    // If an address field is provided, all must be provided
    const is_address_provided = [street_address, city, postal_code, state, country].some(elem => elem)
    const is_full_address_provided = [street_address, city, postal_code, state, country].every(elem => elem)
    if(is_address_provided && !is_full_address_provided) return next({status: 400, message: 'Missing some address fields',  error_source: 'backend', error_route: '/restaurant/visit'})

    try {
        let restaurants = await prisma.restaurant.findMany({
            where: {
                page_visits: {
                    some: {
                        consumer_id: {
                            equals: consumer_id
                        }
                    }
                }
            },
            include: { 
                address: true, 
                ratings: true 
            }
        })

        // Add ratings & distance fields if possible
        const add_rating_distance_n_favorite = await add_rating_distance_n_favorite_wrapper(restaurants, is_full_address_provided, street_address, city, postal_code, state, country)
        restaurants = await add_rating_distance_n_favorite(req, res, next)

        res.status(200).json(restaurants)
    } catch (err) {
        next(err)
    }
})

// Used to get the restaurants from a consumer's orders
// NOTE: Consumer View
router.get('/order/:consumer_id', check_auth(user_types_check.consumer), async (req, res, next) => {
    let {consumer_id} = req.params
    consumer_id = parseInt(consumer_id)

    const {street_address, city, postal_code, state, country} = req.query

    // If an address field is provided, all must be provided
    const is_address_provided = [street_address, city, postal_code, state, country].some(elem => elem)
    const is_full_address_provided = [street_address, city, postal_code, state, country].every(elem => elem)
    if(is_address_provided && !is_full_address_provided) return next({status: 400, message: 'Missing some address fields',  error_source: 'backend', error_route: '/restaurant/order'})

    try {
        let restaurants = await prisma.restaurant.findMany({
            where: {
                orders: {
                    some: {
                        consumer_id: {
                            equals: consumer_id
                        }
                    }
                }
            },
            include: { 
                address: true, 
                ratings: true 
            }
        })

        // Add ratings & distance fields if possible
        const add_rating_distance_n_favorite = await add_rating_distance_n_favorite_wrapper(restaurants, is_full_address_provided, street_address, city, postal_code, state, country)
        restaurants = await add_rating_distance_n_favorite(req, res, next)

        res.status(200).json(restaurants)
    } catch (err) {
        next(err)
    }
})

// Used to get the restaurants from a consumer's favorited restaurants
// NOTE: Consumer view
router.get('/favorited/:consumer_id', check_auth(user_types_check.consumer), async (req, res, next) => {
    let {consumer_id} = req.params
    consumer_id = parseInt(consumer_id)

    const {street_address, city, postal_code, state, country} = req.query

    // If an address field is provided, all must be provided
    const is_address_provided = [street_address, city, postal_code, state, country].some(elem => elem)
    const is_full_address_provided = [street_address, city, postal_code, state, country].every(elem => elem)
    if(is_address_provided && !is_full_address_provided) return next({status: 400, message: 'Missing some address fields',  error_source: 'backend', error_route: '/restaurant/favorited'})

    try {
        let restaurants = await prisma.restaurant.findMany({
            where: {
                favorited_by_consumers: {
                    some: {
                        consumer_id: consumer_id,
                        is_favorited: true,
                    }
                }
            },
            include: { 
                address: true, 
                ratings: true 
            }
        })

        // Add ratings & distance fields if possible
        const add_rating_distance_n_favorite = await add_rating_distance_n_favorite_wrapper(restaurants, is_full_address_provided, street_address, city, postal_code, state, country)
        restaurants = await add_rating_distance_n_favorite(req, res, next)

        res.status(200).json(restaurants)
    } catch (err) {
        next(err)
    }
})


module.exports = router