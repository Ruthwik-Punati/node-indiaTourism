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

// serving static files
app.use(express.static(`../frontend/indiaTourism`))
app.use(express.static(`../frontend/login/dist`))
app.use(express.static('../frontend/chat/dist'))
app.use(express.static('../frontend/chat/assets'))

app.use('/auth', userRouter)

app.use('/food', foodRouter)

app.use('/review', reviewRouter)

app.use('/chat/', chatRouter)

app.all('*', (req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'This route is not defined' })
})

app.use(globalErrorHandler)

module.exports = app
