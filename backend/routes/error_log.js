const express = require('express')
const router = express.Router()


// Endpoint for frontend to register rrors
router.post('/', async (req, res, next) => {
    if(!req.body) next({status: 400, message: "Failed to log error due to missing req.body", error_source: 'backend', error_route: '/error_log'})
        
    const { status, message } = req.body
    if(!status || !message ) next({status: 400, message: "Failed to log error due to missing req.body parameters", error_source: 'backend', error_route: '/error_log'})

    return next({status: status, message: message, error_source: 'frontend'})
})

module.exports = router