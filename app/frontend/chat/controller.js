import { io } from 'socket.io-client'
console.log('web sockets')
const socket = io()

import contacts from './views/contacts'
import chat from './views/chat'
import * as model from './model'
import groups from './views/groups'
import groupChat from './views/groupChat'
import model from './model'

import messages from './views/messages'
import SearchForm from './views/SearchForm'
import contactList from './views/contactList'

import onlyContacts from './views/onlyContacts'
import groupMessages from './views/groupMessages'

model.setUser()
const user = model.getUser()

function contactHandler(contactName) {
  model.setSelectedContact(contactName)
  const selectedContact = model.getSelectedContact()

  socket.emit('messages', user._id, selectedContact.user._id)
}

function emitContacts() {
  socket.emit('contacts', user._id)
}

function groupHandler(groupName) {
  model.setSelectedGroup(groupName)

  socket.emit('groupMessages', model.getSelectedGroup()._id)
}

function handlerSearch(searchText) {
  model.filterContacts(searchText)

  contactList.render(model.getFilteredContacts())
}

function renderContacts(data) {
  contacts.render(data)
}

function renderChat() {
  chat.render(model.getMessages())

  chat.scrollBottom()
}
function renderGroupChat() {
  groupChat.render(model.getGroupMessages())

  groupChat.scrollBottom()
}

function messageHandler(message) {
  socket.emit('message', user._id, model.getSelectedContact().user._id, message)
}
function groupMessageHandler(groupMessage) {
  socket.emit(
    'groupMessage',
    user._id,
    model.getSelectedGroup()._id,
    groupMessage
  )
}

function addEvents() {
  onlyContacts.addSelectHandler(contactHandler)
  groups.addSelectHandler(groupHandler)
  chat.addSendMessageHandler(messageHandler)
  groupChat.addSendMessageHandler(groupMessageHandler)
  chat.addBackToContactsHandler(emitContacts)
  SearchForm.addHandlerSearch(handlerSearch)
}
function init() {
  socket.on('contacts', (data) => {
    model.setContacts(data)

    renderContacts(model.getContacts())
  })

  emitContacts()

  socket.on('message', (message) => {
    messages.addNewMessage({ msg: message })
    model.addMessage(message)

    messages.scrollBottom()
  })

  socket.on('messages', (messages) => {
    console.log(messages)
    model.setMessages(messages)
    renderChat()
  })

  socket.on('groupMessages', (groupMessages) => {
    console.log(groupMessages)
    model.setGroupMessages(groupMessages)
    renderGroupChat()
  })

  socket.on('groupMessage', (groupMessage) => {
    const prevMsg = model.getGroupMessages().at(-1)
    groupMessages.addNewMessage({ msg: groupMessage, prevMsg })
    model.addGroupMessage(groupMessage)
    groupMessages.scrollBottom()
  })

  addEvents()
}

init()
