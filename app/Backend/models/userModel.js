const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, 'User already exists with this name'],
    required: [true, 'A user must have a name!'],
    minLength: [3, 'Name should contain atleast 3 charactors!'],
    maxLength: [20, 'Name must not exceed 15 characters!'],
    select: true,
  },
  email: {
    type: String,
    unique: [true, 'User already exists with this email'],
    required: [true, 'User must provide email!'],
  },
  password: {
    type: String,
    required: [true, 'User must have a password!'],
    minLength: [8, 'Password must contain atleast 8 characters!'],
    maxLength: [20, 'Password must not exceed 15 characters!'],
  },

  passwordConfirm: {
    type: String,
    required: [true, 'plesae confirm your password!'],
    validate: [
      function (val) {
        return this.password === val
      },
      'Password and Confirm password are not the same!',
    ],
  },
  passwordChangedAt: Date,
  passwordResetExpires: Date,
  passwordResetToken: String,
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10)
    this.passwordConfirm = undefined
    this.passwordChangedAt = new Date() + 1000
  }
  next()
})

userSchema.methods.comparePassword = async (inputPassword, DBPassword) => {
  return await bcrypt.compare(inputPassword, DBPassword)
}

userSchema.methods.createResetPasswordToken = async function () {
  const token = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return token
}

userSchema.methods.isPasswordChangedAfterLogin = function (initiatedAt) {
  return this.passwordChangedAt / 1000 > initiatedAt
}

const UserModel = mongoose.model('Visitor', userSchema)

module.exports = UserModel
