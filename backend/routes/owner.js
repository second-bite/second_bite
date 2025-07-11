const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')
const argon2 = require('argon2')

const {user_types, user_types_check, check_auth} = require('./user_auth')

// Used to retrieve owner details (for Edit Owner Account page)
router.get('/', check_auth(user_types_check.owner), async (req, res, next) => {
    try {
        const owner_id = req.session.user_id
        const owner = await prisma.owner.findUnique({
            where: {owner_id: owner_id},
            include: {
                address: true,
                restaurants: true,
            }
        })

        if(!owner) {
            return next({status: 404, message: "Owner not found"});
        }

        // const {password, ...visible_owner_info} = owner
        // res.status(200).send(visible_owner_info)
        res.status(200).send(owner)
    } catch (err) {
        next(err)
    }
})

// Used to edit account details
// NOTE: Business Owner View
router.put('/', check_auth(user_types_check.owner), async (req, res, next) => {
    try {
        const owner_id = req.session.user_id

        if (!req.body) return next({status: 400, message: `Missing request body for account edit`})

        for(const required_field of user_types.owner.required) {
            if(!req.body[required_field]) {
                return next({status: 400, message: `Missing required field ${required_field}`})
            }
        }

        // Enforce password security
        if(req.body.password.length < 8) {
            return next({status: 400, message: `Password must be at least 8 characters long.`})
        }

        // Check if username or email are already taken
        const username = req.body.username
        const existing_username_owner = await prisma.owner.findUnique({ where: {username: username} })
        if(existing_username_owner && existing_username_owner.owner_id !== owner_id) {
            return next({status: 400, message: `Username is already taken`})
        }

        // Hash the password before storing
        const hashed_pwd = await argon2.hash(req.body.password)

        // Create a new user in the database
        const data = {
            username,
            password: hashed_pwd,
            address: {
                update: {
                    street_address: req.body.street_address,
                    city: req.body.city,
                    state: req.body.state,
                    postal_code: req.body.postal_code,
                    country: req.body.country, 
                }
            }
        }

        const owner = await prisma.owner.update({
            where: { owner_id: owner_id },
            data: data,         
            include: {address: true}      
        })

        res.status(200).json({ id: owner.owner_id, username: owner.username })
    } catch (err) {
        return next(err);
    }
})

// // Used to delete account
// // NOTE: Business Owner View
// router.delete('/consumer', (req, res) => {

// })

module.exports = router