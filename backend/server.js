const express = require('express')
const session = require('express-session')
const cookie_parser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
const app = express()
const PORT = 3000

app.use(express.json())

const allowed_cors_origins = ['http://localhost:5173', 'http://localhost:3000']
app.use(cors({
  origin: allowed_cors_origins,
  credentials: true
}));

app.use(session({
    secret: 'second-bite',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60, sameSite: 'lax' }
}))

app.use(cookie_parser())

// Routes
const { auth_routes } = require('./routes/user_auth')
const restaurant_routes = require('./routes/restaurant')
const owner_routes = require('./routes/owner')
const consumer_routes = require('./routes/consumer')
const error_log_routes = require('./routes/error_log')
const prisma = require('./routes/prisma_client')

app.use('/auth', auth_routes)
app.use('/restaurant', restaurant_routes)
app.use('/owner', owner_routes)
app.use('/consumer', consumer_routes)
app.use('/error_log', error_log_routes)

// Error Handling Middleware
app.use(async (err, req, res, next) => {
    console.log('Error Handling Middleware called', err)
    const { message, status = 500, error_source = 'backend', error_route } = err

    const new_error = {
        message: message,
        status: status,
        error_source: error_source,
    };

    // Optionally add error route (only applies for backend errors)
    // console.log(error_route);
    (error_route) ? (new_error.route = error_route) : null ;
    
    try {
        const logged_error = await prisma.errorLog.create({
            data: new_error
        })
    }
    catch(err) {console.error(err)}
    // Send to client
    res.status(status).json({message: 'Error: ' + message, status: status})
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})