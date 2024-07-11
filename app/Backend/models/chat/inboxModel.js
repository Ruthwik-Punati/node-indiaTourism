const mongoose = require('mongoose')

const withSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Visitor',
    required: true,
  },
  lastMsg: {
    type: mongoose.Schema.ObjectId,
    ref: 'Message',
  },
})
const inboxSchema = mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'Visitor', required: true },
  with: [withSchema],
})

const inboxModel = mongoose.model('Inbox', inboxSchema)

module.exports = inboxModel
