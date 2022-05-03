const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')

const errorMiddleware = require('./middlewares/errors')

// Setting up config file
//uncomment if production mode
if(process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })

app.use(express.json())
app.use(cookieParser())

//Import all routes
const orders = require('./routes/order')
const products = require('./routes/product')
const auth = require('./routes/auth')
const cart = require('./routes/cart')
const stocks = require('./routes/stock')

app.use('/api/v1', orders)
app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', cart)
app.use('/api/v1', stocks)

//uncomment if production mode
if(process.env.NODE_ENV === 'PRODUCTION'){
    app.use(express.static(path.join(__dirname, '../frontend/build')))
    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

// Middleware to handle errors
app.use(errorMiddleware)

module.exports = app