const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.ObjectId },
  receiver: { type: mongoose.Schema.ObjectId },
  message: { type: String },
  sentAt: { type: Date, default: Date.now },
})

const messageModel = mongoose.model('Message', messageSchema)

module.exports = messageModel
