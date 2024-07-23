const User = require('../models/userModel')
const crypto = require('crypto')
const catchAsync = require('../catchAsync')
const axios = require('axios')

const fs = require('fs')

const JWT = require('jsonwebtoken')
const AppError = require('../AppError')
const sendMail = require('../nodeMailer')
const inboxModel = require('../models/chat/inboxModel')
const Group = require('../models/chat/groupModel')
const messageModel = require('../models/chat/messageModel')

function JWTToken(user) {
  return JWT.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  })
}

function sendToken(user, res, message = 'Login successfull!') {
  const token = JWTToken(user)
  res.cookie('JWToken', token)
  res.status(200).json({
    status: 'success',
    message,
    data: { user: { name: user.name, _id: user._id }, token },
  })
}

module.exports.validateEmail = catchAsync(async (req, res, next) => {
  await axios
    .get(
      `https://www.ipqualityscore.com/api/json/email/puvdwcQ9FTgB19AT0TLtjqbd3z862dpV/${req.body.email}`
    )
    .then((response) => {
      console.log(response.data)
      const deliverability = response.data.deliverability
      if (deliverability === 'high' || deliverability === 'medium') {
        next()
      } else {
        next(new AppError('Please provide valid mail!', 404))
      }
    })
    .catch((error) => {
      next(new AppError(error.message, 404))
    })
})

module.exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body)

  const message = await messageModel.create({
    sender: `${process.env.GOOGLE_AI_ID}`,
    receiver: user._id,
    message: `Welcome, ${user.name}!`,
  })

  await inboxModel.create({
    user: user._id,
    with: [{ user: `${process.env.GOOGLE_AI_ID}`, lastMsg: message._id }],
  })

  await Promise.all([
    await inboxModel.updateOne(
      { user: `${process.env.GOOGLE_AI_ID}` },
      {
        $push: {
          with: { user: user._id, lastMsg: message._id },
        },
      }
    ),
    await Group.findOneAndUpdate(
      { name: 'Dream Team' },
      { $push: { users: user.id } }
    ),
  ])
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
    next(new AppError('Wrong password!', 404))
    return
  }
  sendToken(user, res)
})

module.exports.protect = catchAsync(async (req, res, next) => {
  // const token = req.headers.authorization?.split(' ')?.[1]

  const token = req.cookies.JWToken

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
    next(new AppError('Invalid email!', 404))
  }

  const resetToken = await user.createResetPasswordToken()

  await user.save({ validateBeforeSave: false, isNew: false })

  const resetLink = `${req.protocol}://${req.get(
    'host'
  )}/auth/resetPasswordPage/${resetToken}`

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
  const resetPasswordPage = fs.readFileSync(`../frontend/login/dist/reset.html`)

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
