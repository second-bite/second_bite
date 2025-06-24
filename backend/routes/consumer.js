const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')

/**
 * Edit Account Details
 */

// Used to edit account details
// NOTE: Consumer View
router.patch('/consumer/:id', (req, res) => {
    const {consumer_id} = req.params
    const {...} = req.body // TODO: Add defaault empty values here (to isolate what changed)
})

// Used to delete account
// NOTE: Consumer View
router.delete('/consumer', (req, res) => {

})

/**
 * Friend Feature
 */

// Used to get list of consumers (possibly on an Add Friend Search feature?)
// NOTE: Consumer View
router.get('/consumer', (req, res) => {
    const {...} = req.query
})
