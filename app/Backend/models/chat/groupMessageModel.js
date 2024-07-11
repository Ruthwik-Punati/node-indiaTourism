const mongoose = require('mongoose')

const groupMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.ObjectId, ref: 'Visitor' },
  group: { type: mongoose.Schema.ObjectId, ref: 'Group' },
  message: { type: String },
  sentAt: { type: Date, default: Date.now() },
})

const groupMessageModel = mongoose.model('GroupMessage', groupMessageSchema)

module.exports = groupMessageModel
