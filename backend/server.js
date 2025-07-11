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

app.use('/auth', auth_routes)
app.use('/restaurant', restaurant_routes)
app.use('/owner', owner_routes)
app.use('/consumer', consumer_routes)

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { message, status = 500 } = err
    console.log(message)
    res.status(status).json({message: 'Error: ' + message})
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})