const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')

// Provide feedback on the app
// NOTE: Both Business Owner & Consumer Views
router.post('/feedback', (req, res) => {
    const {...} = req.body
})