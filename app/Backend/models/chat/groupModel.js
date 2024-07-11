const mongoose = require('mongoose')

const groupSchema = mongoose.Schema({
  name: String,
  users: [{ type: mongoose.ObjectId, ref: 'Visitor' }],
  lastMsg: { type: mongoose.ObjectId, ref: 'GroupMessage' },
})

const GroupModel = mongoose.model('Group', groupSchema)

module.exports = GroupModel
