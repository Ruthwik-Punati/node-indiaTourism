const User = require('./userModel')
const crypto = require('crypto')
const catchAsync = require('./catchAsync')

const fs = require('fs')

const JWT = require('jsonwebtoken')
const AppError = require('./AppError')
const sendMail = require('./nodeMailer')

function JWTToken(user) {
  return JWT.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  })
}

function sendToken(user, res, message = 'Login successfull!') {
  const token = JWTToken(user)
  res.cookie('JWToken', token)
  res.status(200).json({ status: 'success', message, data: { token } })
}

module.exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body)

  sendToken(user, res)
})

module.exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    next(
      new AppError(
        "User not found! Please sign up if you don't have an account!",
        404
      )
    )
  }

  if (user && !(await user.comparePassword(req.body.password, user.password))) {
    next(new AppError('Wrong password!', 401))
    return
  }
  sendToken(user, res)
})

module.exports.protect = catchAsync(async (req, res, next) => {
  // const token = req.headers.authorization?.split(' ')?.[1]

  const token = req.cookies.JWToken

  console.log(token)

  if (!token) {
    next(new AppError('Please login!', 401))
    return
  }

  const payload = await JWT.verify(token, process.env.JWT_SECRET)

  const { id, iat } = payload

  const user = await User.findById(id)

  if (!user) {
    next(new AppError('user not found', 404))
  }

  if (await user.isPasswordChangedAfterLogin(iat)) {
    next(
      new AppError(
        'You changed password after logging in. Please login again!',
        401
      )
    )
  }

  req.user = user

  next()
})

module.exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    next(new AppError('Invalid email!'))
  }

  const resetToken = await user.createResetPasswordToken()

  await user.save({ validateBeforeSave: false, isNew: false })

  const resetLink = `${req.protocol}://${req.get(
    'host'
  )}/resetPasswordPage/${resetToken}`

  await sendMail({
    to: req.body.email,
    subject: 'Reset Password',
    text: `reset your password with this link ${resetLink}`,
  })
  res.status(200).json({
    status: 'success',
    message: 'Reset email sent successfully!',
    resetLink,
  })
})

module.exports.validateResetToken = catchAsync(async (req, res, next) => {
  const resetToken = req.params.resetToken

  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  if (!user) {
    return next(new AppError('Token is invalid or expired!'), 400)
  }

  req.user = user
  next()
})

module.exports.resetPasswordPage = catchAsync(async (req, res, next) => {
  const resetPasswordPage = fs.readFileSync(`../frontend/dist/reset.html`)

  res.end(resetPasswordPage)
})

module.exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = req.user

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  // this.passwordResetToken = undefined
  // this.passwordResetExpires = undefined

  await user.save()

  sendToken(user, res, 'password reset successfull!')
})
