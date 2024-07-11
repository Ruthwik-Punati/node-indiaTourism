const express = require('express')
const {
  getChat,
  createMessage,
  updateMessage,
  deleteMessage,
  getCart,
} = require('../controllers/chatController')
const chatRouter = express.Router()

chatRouter.route('/').get(getChat).post(createMessage)

chatRouter.route('/id').patch(updateMessage).delete(deleteMessage)

// chatRouter.route('/products').get(getCart)

module.exports = chatRouter
