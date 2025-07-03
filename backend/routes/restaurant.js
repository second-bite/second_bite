const express = require('express')
const router = express.Router()
const prisma = require('./prisma')

const {user_types_check, check_auth} = require('./user_auth')

/** 
 * Fundamental Operations
 */

// Get list of all restaurants (w/ desired filters, etc - used for Main Search Page)
// NOTE: Consumer View
router.get('/restaurant', (req, res) => {
    const {...} = req.query
})

// Get a specific restaurant by its ID (for restaurant pop-up modals)
// NOTE: Consumer View
router.get('/restaurant/:id', (req, res) => {
    const {restaurant_id} = req.params
})

// Create new restaurant entry
// NOTE: Business Owner View
router.post('/restaurant', check_auth(user_types_check.owner),  async (req, res, next) => {
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

        const { restaurant_id_, address_id_, owner_id_, ...public_response} = restaurant
        res.status(201).json( public_response )
    } catch (err) {
        return next(err)
    }
})

// Edit existing restaurant entry
// NOTE: Business Owner View 
router.put('/restaurant/:id', (req, res) => {
    const {restaurant_id} = req.params
    const {...} = req.body
})

// Delete existing restaurant entry
// NOTE: Business Owner View
router.delete('/restaurant/:id', (req, res) => {
    const {restaurant_id} = req.params
})

/**
 * Ratings/Reviews
 */
// Rate restaurant
// NOTE: Consumer View
router.post('/restaurant/rating/:id') {
    const {restaurant_id} = req.params
    const {...} = req.body
}