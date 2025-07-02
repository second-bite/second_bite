const express = require('express')
const router = express.Router()
const prisma = require('./prisma')

const {check_auth}

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
router.post('/restaurant/:owner_id', (req, res) => {
    const {owner_id} = req.params
    const {...} = req.body
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