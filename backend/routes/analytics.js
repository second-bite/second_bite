import { check_auth } from './user_auth'

const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')

const {user_types_check, check_auth} = require('./user_auth')

// Allows the owner to retrieve all visits for a specific restaurant
// NOTE: Consumer View
router.get('/visits/:restaurant_id', check_auth(user_types_check.owner), async (req, res, next) => {
    try {
        

    } catch (err) {
        next(err)
    }
})


export default router