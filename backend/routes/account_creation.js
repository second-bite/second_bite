const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')

// Auth


// Create new consumer user
// NOTE: Consumer View
router.post('/user', async (req, res) => {
    const {username, password, password_confirm, email, location} = req.body;

    // Check all required fields are entered
    if(!username || !password || !password_confirm || !email || !location) {
        return res.status(400).json({ error: "All fields are required to create an account."})
    }

    // Check passwords match
    if(password !== password_confirm) {
        return res.status(400).json({ error: "Passwords must match" })
    }

    // Enforce password security
    if(password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long."})
    }

    // TODO: Ensure usernames don't overlap
    const existing_user = 
})

// Create new business owner account
// NOTE: Business Owner View
router.post('/owner', (req, res) => {
    const {username, password, password_confirm, email} = req.body;
})

module.exports = router;

