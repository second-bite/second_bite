const express = require('express')
const session = require('express-session')
const cors = require('cors')
const app = express()
const PORT = 3000

app.use(express.json())

const allowed_cors_origins = ['http://localhost:5173', 'http://localhost:3000']
app.use(cors({
  origin: allowed_cors_origins,
  credentials: true
}));

const { auth_routes } = require('./routes/user_auth')

app.use(session({
    secret: 'second-bite',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60, sameSite: 'none' }
}))

app.use('/auth', auth_routes)

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { message, status = 500 } = err
    console.log(message)
    res.status(status).json({message: 'Error: ' + message})
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})