const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')

const {user_types_check, check_auth} = require('./user_auth')

// Used to retrieve currently logged in consumer's details
// NOTE: Consumer View
router.get('/', check_auth(user_types_check.consumer), async (req, res, next) => {
    try {
        const consumer_id = req.session.user_id
        const consumer = await prisma.consumer.findUnique({
            where: {consumer_id: consumer_id},
            include: {
                address: true,
            }
        })

        if(!consumer) {
            return next({status: 404, message: "Consumer not found"});
        }

        // const {password, ...visible_owner_info} = owner
        // res.status(200).send(visible_owner_info)
        res.status(200).send(consumer)
    } catch (err) {
        next(err)
    }
})

/**
 * Edit Account Details
 */
// Used to edit account details
// TODO:
// NOTE: Consumer View
// router.patch('/consumer/:id', (req, res) => {
//     const {consumer_id} = req.params
//     const {...} = req.body // TODO: Add defaault empty values here (to isolate what changed)
// })

// Used to delete account
// TODO:
// NOTE: Consumer View
// router.delete('/consumer', (req, res) => {

// })

/**
 * Friend Feature
 */
// TODO: 
// Used to get list of consumers (possibly on an Add Friend Search feature?)
// NOTE: Consumer View
// router.get('/consumer/all', (req, res) => {
//     const {...} = req.query
// })

module.exports = router