const express = require('express')
const router = express.Router()
const prisma = require('./prisma_client')
const argon2 = require('argon2')

// User Types (used for modularity)
const user_types = {
    consumer : {
        type: 'consumer',
        required: ['username', 'email', 'password', 'location']
    },
    owner: {
        type: 'owner',
        required: ['username', 'email', 'password']
    }
}

// Register a new account
// NOTE: Consumer or Business Owner View (depending on params)
router.post(`/register/:user_type_param`, async (req, res, next) => {
    const { user_type_param } = req.params;
    try{
        const user_type = user_types[user_type_param]

        for(const required_field of user_type.required) {
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
        const email = req.body.email
        const existing_username = await prisma[user_type.type].findUnique({ where: {username: username} })
        if(existing_username) {
            return next({status: 400, message: `Username is already taken`})
        }
        const existing_email = await prisma[user_type.type].findUnique({ where: {email: email} })
        if (existing_email) {
            return next({status: 400, message: `Email has already been used`})
        }

        // Hash the password before storing
        const hashed_pwd = await argon2.hash(req.body.password)

        // Create a new user in the databasec
        const data = {
            username,
            email,
            password: hashed_pwd,
            ...((user_type_param === 'consumer') && { location: req.body.location })
        }
        const user = await prisma[user_type.type].create({
            data: data,               
        })

        res.status(201).json({ id: (user_type_param === 'consumer') ? user.consumer_id : user.owner_id, email: email, user_type: user_type_param} )
    } catch (err) {
        return next(err);
    }
})




// User log in
// NOTE: Consumer or Business Owner View (depending on params)
router.post('/login/:user_type_param', async (req, res, next) => {
    const { user_type_param } = req.params;
    const { username, password } = req.body
    try{
        const user_type = user_types[user_type_param]

        // Check that username and password have been entered
        if(!username || !password) {
            return next({status: 400, message: `Username and password are required`})
        }

        // Check if this is a valid user
        const user = await prisma[user_type.type].findUnique({ where: {username: username} })
        if(!user) {
            return next({status: 401, message: `User not found`})
        }
        const is_valid_pwd = await argon2.verify(user.password, password)
        if(!is_valid_pwd) {
            return next({status: 401, message: 'Invalid password'})
        }

        // Stored user ID, username, & user type in the session
        const user_id = (user_type_param === 'consumer') ? user.consumer_id : user.owner_id
        req.session.user_id = user_id
        req.session.username = user.username
        req.session.user_type = user_type_param

        res.status(200).json({ id: req.session.user_id, username: user.username, user_type: req.session.user_type })
    } catch (err) {
        return next(err);
    }
})




// TODO: Add check if a user is logged in
// Check if user is logged in
router.get('/check_session', async (req, res, next) => {
    if(!req.session.user_id) { 
        return res.status(401).json( { message: "Not logged in" })
    }

    try {
        const user = await prisma[req.session.user_type].findUnique({
            where: { id: req.session.user_id },
            select: { username: true }
        })
        res.status(200).json({ id: req.session.user_id, username: user.username, user_type: req.session.user_type })
    } catch (err) {
        console.error(err);
        next({status: 500, message: "Error fetching user session data"})
    }
})


// User log out
// NOTE: Consumer or Business Owner View (depending on params)
router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if(err) {
            return next({status: 500, message: err})
        }

        // Clear session cookie
        res.clearCookie('connect.sid')
        res.status(200).json({ message: "Logout successful! "})
    })
})


module.exports = router;

