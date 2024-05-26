const fs = require('fs')

const express = require('express')
const cookieParser = require('cookie-parser')
const {
  signUp,
  login,
  loginPage,
  protect,
  indiaTourism,
  forgotPassword,
  resetPassword,
  resetPasswordPage,
  validateResetToken,
} = require('./authController')

const globalErrorHandler = require('./errorController')

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use(express.static(`../frontend/dist`))
app.use('/main', protect, express.static(`../../India-Tourism-master`))

// app.route('/login').get(loginPage)

app.route('/signUp').post(signUp)

app.route('/forgotPassword').post(forgotPassword)

app
  .route('/resetPasswordPage/:resetToken')
  .get(validateResetToken, resetPasswordPage)
app.route('/resetPassword/:resetToken').post(validateResetToken, resetPassword)

app.route('/userLogin').post(login)
// app.route('/indiaTourism').get(protect, indiaTourism)

app.all('*', (req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'This route is not defined' })
})

app.use(globalErrorHandler)

module.exports = app
