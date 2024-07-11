const {
  signUp,
  login,

  forgotPassword,
  resetPassword,
  resetPasswordPage,
  validateResetToken,
  validateEmail,
} = require('../controllers/authController')

const express = require('express')

const userRouter = express.Router()

userRouter.route('/signUp').post(validateEmail, signUp)
userRouter.route('/login').post(login)

userRouter.route('/forgotPassword').post(forgotPassword)

userRouter
  .route('/resetPasswordPage/:resetToken')
  .get(validateResetToken, resetPasswordPage)
userRouter
  .route('/resetPassword/:resetToken')
  .post(validateResetToken, resetPassword)

module.exports = userRouter
