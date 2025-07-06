const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')

const {user_types_check, check_auth} = require('./user_auth')

/** 
 * Fundamental Operations
 */

// TODO:
// Get list of all restaurants (w/ desired filters, etc - used for Main Search Page)
// NOTE: Consumer View
router.get('/', check_auth(user_types_check.consumer), async (req, res, next) => {
    const {search_query, categories, street_address, city, postal_code, state, country} = req.query

    // If an address field is provided, all must be provided
    const is_address_provided = [street_address, city, postal_code, state, country].some(elem => elem)
    const all_address_provided = [street_address, city, postal_code, state, country].every(elem => elem)
    if(is_address_provided && !all_address_provided) return next({status: 400, message: 'Missing some address fields'})
    
    let filters = {}
    try {
        filters.include = { address: true, categories: true, ratings: true }
        filters.take = 25 // Ideally helps reduce exhaustion & allows request batching of Google Maps Distance Matrix API
        

        // Apply filters
        if(categories || search_query) {
            filters.where = {}
        }
        if(categories) {
            filters.where.categories = {}
            categories = categories.split(',')
            if(categories.length === 1) {
                filters.where.categories.has = categories[0]
            } else {
                filters.where.categories.hasSome = categories
            }
        }
        if(search_query?.trim()) {
            filters.where.name = {
                contains: search_query,
                mode: 'insensitive',
            }
        }

        let restaurants = await prisma.restaurant.findMany(filters)

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
        if(all_address_provided) {
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



        // TODO: Migrate sorting to frontend
        // Apply sorting filter
        // if(sort_by) {
        //     filters.orderBy = []
        //     switch(sort_by) {
        //         case 'rating':
        //             // Retrieve ratings & sort
        //             const sorted_ratings_per_restaurant = await prisma.rating.groupBy({
        //                 by: ['restaurant_id'],
        //                 _avg: {
        //                     num_stars: true,
        //                 },
        //                 orderBy: { _avg: { num_stars: 'desc' }}
        //             })

        //             // Retrieve restaurants & match sorting
        //             restaurants = await prisma.restaurant.findMany(filters)
        //             const sorted_restaurant_ids = (sorted_ratings_per_restaurant).map(restaurant => restaurant.restaurant_id)
        //             const sorted_id_to_ind = new Map(sorted_restaurant_ids.map((restaurant_id, ind) => [restaurant_id, ind]))
        //             restaurants.sort((a, b) => {
        //                 return ( (sorted_id_to_ind.has(a.restaurant_id) ? sorted_id_to_ind.get(a.restaurant_id) : Infinity) - 
        //                          (sorted_id_to_ind.has(b.restaurant_id) ? sorted_id_to_ind.get(b.restaurant_id) : Infinity) )
        //             })
        //             break
        //         case 'distance':
        //             restaurants = await prisma.restaurant.findMany(filters)
        //             const api_key = process.env.GOOGLE_MAPS_API_KEY
        //             const origin = encodeURIComponent(`${street_address}, ${city}, ${state} ${postal_code}`)
        //             const destinations = restaurants.map((restaurant) => {
        //                 const a = restaurant.address
        //                 return (encodeURIComponent(`${a.street_address}, ${a.city}, ${a.state} ${a.postal_code}`))
        //             }).join('|')
        //             // NOTE: units only seems to apply to distance.text, not value (which is fine for my use case)
        //             const url = `https://maps.googleapis.com/maps/api/distancematrix/json`+ `?origins=${origin}&destinations=${destinations}&units=imperial&key=${api_key}`
        //             const response = await fetch(url)
        //             if (!response.ok) return next({status: response.status, message: "Google Maps Distance Matrix API call failed"})
        //             const res_json = await response.json();
        //             const row = res_json.rows[0]
        //             restaurants = restaurants.map((restaurant, ind) => ({
        //                 ...restaurant, 
        //                 distance_text: row.elements[ind].distance.text,
        //                 distance_value: row.elements[ind].distance.value,
        //             }))
        //             restaurants.sort((a, b) => a.distance_value - b.distance_value)
        //             break
        //         case 'price':
        //             filters.orderBy.push({ avg_cost: 'desc' })
        //             restaurants = await prisma.restaurant.findMany(filters)
        //             break
        //     }
        // } else {
        //     restaurants = await prisma.restaurant.findMany(filters)
        // }

        res.status(200).json(restaurants)
    } catch (err) {
        return next(err)
    }
})

// TODO: 
// Get a specific restaurant by its ID (for restaurant pop-up modals)
// NOTE: Consumer View
// router.get('/:id', (req, res) => {
//     const {restaurant_id} = req.params
// })

// Create new restaurant entry
// NOTE: Business Owner View
router.post('/', check_auth(user_types_check.owner),  async (req, res, next) => {
    try {
        const owner_id = req.session.user_id
        if (!req.body) return next({status: 400, message: `Missing request body for account register`})

        const required_fields = [`name`, `descr`, `address`, `categories`, `img_url`, `img_alt`, `avg_cost`, `pickup_time`]
        const required_address_fields = [`street_address`, `city`, `postal_code`, `state`, `country`]
        for(const required_field of required_fields) {
            if(!req.body[required_field]) {
                return next({status: 400, message: `Missing required field ${required_field}`})
            }
        }
        for(const required_address_field of required_address_fields) {
            if(!req.body.address[required_address_field]) {
                return next({status: 400, message: `Missing required address field ${required_address_field}`})
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

// TODO:
// Edit existing restaurant entry
// NOTE: Business Owner View 
// router.put('/:id', (req, res) => {
//     const {restaurant_id} = req.params
//     const {...} = req.body
// })


// Delete existing restaurant entry
// NOTE: Business Owner View
router.delete('/:id', check_auth(user_types_check.owner), async (req, res, next) => {
    try {
        let {id} = req.params
        id = parseInt(id)
        const deleted_restaurant = await prisma.restaurant.delete({
            where: {restaurant_id: id}
        })

        const {restaurant_id, owner_id, ...visible_deleted_restaurant} = deleted_restaurant
        res.status(200).send(visible_deleted_restaurant)
    } catch (err) {
        return next(err)
    }
})

// TODO:
/**
 * Ratings/Reviews
 */
// Rate restaurant
// NOTE: Consumer View
// router.post('/rating/:id') {
//     const {restaurant_id} = req.params
//     const {...} = req.body
// }


module.exports = router