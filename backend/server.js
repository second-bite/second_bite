const express = require('express')
const app = express()
const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

// Error Handling
app.use((err, req, res, next) => {
    const { message, status = 500 } = err
    res.status(status).json({message: 'Error: ', message})
})