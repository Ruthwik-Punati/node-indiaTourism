const fs = require('fs')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const rateLimit = require('express-rate-limit')

const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const { protect } = require('./controllers/authController')

const globalErrorHandler = require('./controllers/errorController')
const foodRouter = require('./routers/foodRouter')
const reviewRouter = require('./routers/reviewRouter')

const userRouter = require('./routers/userRouter')
const chatRouter = require('./routers/chatRouter')
const { resolve } = require('path')

const app = express()

app.use(morgan('dev'))

app.use(express.json())
app.use(xss())
app.use(mongoSanitize())
app.use(hpp())
// const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 1000000000 })
// app.use(limiter)

app.use(cookieParser())

app.use('/india.html', protect)
app.use('/chat.html', protect)
app.use('/reset.html', protect)
// serving static files
app.use(express.static(`../frontend/indiaTourism`))
app.use(express.static(`../frontend/login/dist`))
app.use(express.static('../frontend/chat/dist'))
app.use(express.static('../frontend/chat/assets'))

app.use('/auth', userRouter)

app.use('/food', foodRouter)

app.use('/review', reviewRouter)

app.use('/chat/', chatRouter)

app.use('/fun', (req, res) => {
  setTimeout(() => {
    res.status(200).json([
      {
        id: 1,
        name: 'John Doe',
        age: 30,
        username: 'johndoe',
        email: 'john.doe@example.com',
        address: {
          street: '123 Main Street',
          city: 'Cityville',
          zip: '12345',
        },
        phone: '555-123-4567',
        website: 'www.johndoe.com',
        occupation: 'Software Engineer',
        hobbies: ['Reading', 'Gaming'],
      },
      {
        id: 2,
        name: 'Jane Smith',
        age: 25,
        username: 'janesmith',
        email: 'jane.smith@example.com',
        address: {
          street: '456 Park Avenue',
          city: 'Townsville',
          zip: '54321',
        },
        phone: '555-987-6543',
        website: 'www.janesmith.com',
        occupation: 'Graphic Designer',
        hobbies: ['Painting', 'Traveling'],
      },
      {
        id: 3,
        name: 'Michael Johnson',
        age: 40,
        username: 'michaeljohnson',
        email: 'michael.johnson@example.com',
        address: {
          street: '789 Oak Lane',
          city: 'Villageland',
          zip: '67890',
        },
        phone: '555-456-7890',
        website: 'www.michaeljohnson.com',
        occupation: 'Teacher',
        hobbies: ['Sports', 'Writing'],
      },
    ])
  }, 10000)
})

app.all('*', (req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'This route is not defined' })
})

app.use(globalErrorHandler)

module.exports = app
