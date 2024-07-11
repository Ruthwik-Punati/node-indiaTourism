import { io } from 'socket.io-client'
console.log('web sockets')
const socket = io()

// const messagesContainer = document.querySelector('.messages-container')
// const messageInput = document.querySelector('input[name=message]')

// // connection with server
// socket.on('connect', function () {
//   console.log('Connected to Server')
// })

// // message listener from server
// socket.emit('sendAll')
// socket.on('sendAll', function (messages) {
//   messages.forEach((item) => {
//     const p = document.createElement('p')
//     const newMessage = document.createTextNode(item.message)
//     p.appendChild(newMessage)
//     messagesContainer.append(p)
//   })
// })

// socket.on('message', function (message) {
//   const p = document.createElement('p')
//   const newMessage = document.createTextNode(message.message)
//   p.appendChild(newMessage)
//   messagesContainer.append(p)
// })

// // add event listener to form
// document
//   .getElementById('message-form')
//   .addEventListener('submit', function (e) {
//     // prevent the form from submitting
//     e.preventDefault()

//     // emit message from user side
//     socket.emit('message', {
//       message: messageInput.value,
//     })
//   })

// // when disconnected from server
// socket.on('disconnect', function () {
//   console.log('Disconnected from server')
// })

import contacts from './views/contacts'
import chat from './views/chat'
import * as model from './model'
import groups from './views/groups'
import groupChat from './views/groupChat'

function contactHandler() {
  const selectedContact = model.state.selectedContact

  socket.emit('messages', model.state.user._id, selectedContact.user._id)
}

function emitContacts() {
  socket.emit('contacts', model.state.user._id)
}

function groupHandler() {
  const selectedGroup = model.state.selectedGroup
  socket.emit('groupMessages', selectedGroup._id)
}

function renderChat() {
  chat.render(model.state.messages)
  chat.addSendInputHandler(messageHandler)
  chat.addBackToContactsHandler(emitContacts)
  chat.scrollBottom()
}
function renderGroupChat() {
  groupChat.render(model.state.groupMessages)
  groupChat.addSendInputHandler(groupMessageHandler)
  groupChat.addBackToContactsHandler(emitContacts)
  groupChat.scrollBottom()
}

function messageHandler(e) {
  socket.emit(
    'message',
    model.state.user._id,
    model.state.selectedContact.user._id,
    e.target.value
  )
}
function groupMessageHandler(e) {
  socket.emit(
    'groupMessage',
    model.state.user._id,
    model.state.selectedGroup._id,
    e.target.value
  )
}

function init() {
  model.state.user = JSON.parse(localStorage.getItem('user'))

  socket.on('contacts', (data) => {
    model.state.contacts = data

    contacts.render(model.state.contacts)

    contacts.addSelectHandler(contactHandler)
    groups.addSelectHandler(groupHandler)
  })

  emitContacts()

  socket.on('message', (message) => {
    model.state.messages.push(message)

    renderChat()
  })

  socket.on('messages', (messages) => {
    model.state.messages = messages
    renderChat()
  })

  socket.on('groupMessages', (messages) => {
    model.state.groupMessages = messages
    renderGroupChat()
  })

  socket.on('groupMessage', (groupMessage) => {
    model.state.groupMessages.push(groupMessage)
    renderGroupChat()
  })
}

init()
