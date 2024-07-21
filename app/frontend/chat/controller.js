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
import searchForm from './views/searchForm'
import contactList from './views/contactList'

import onlyContacts from './views/onlyContacts'
import groupMessages from './views/groupMessages'

model.setUser()
const user = model.getUser()

function contactHandler(contactName) {
  if (model.getPage() === 'contact') return

  model.setSelectedContact(contactName)
  const selectedContact = model.getSelectedContact()

  socket.emit('messages', user._id, selectedContact.user._id)
}

function emitContacts() {
  if (model.getPage() === 'contacts') return

  socket.emit('contacts', user._id)
}

function groupHandler(groupName) {
  if (model.getPage() === 'group') return

  model.setSelectedGroup(groupName)

  socket.emit('groupMessages', model.getSelectedGroup()._id)
}

function handlerSearch(searchText) {
  model.filterContacts(searchText)

  contactList.update(model.getFilteredContacts())
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
  searchForm.addHandlerSearch(handlerSearch)
}

function init() {
  socket.on('contacts', (data) => {
    model.setContacts(data)
    if (!model.isPage('contacts')) {
      model.setPage('contacts')

      renderContacts(model.getContacts())
    } else {
      contactList.update(model.getContacts())
    }
  })

  emitContacts()

  socket.on('message', (msg) => {
    const isSenderTheUser = msg.sender === user._id

    const senderName =
      isSenderTheUser || model.getMessageSender(msg.sender).name

    sendNotification(senderName, msg.message, isSenderTheUser)

    if (model.isPage('contacts')) {
      socket.emit('contacts', user._id)
      return
    }

    if (!model.isPage('contact')) return

    if (model.getSelectedContact().user._id === msg.sender || isSenderTheUser) {
      const prevMsg = model.getMessages().at(-1)
      chat.addNewMessage({ msg, prevMsg })
      model.addMessage(msg)

      messages.scrollBottom()
    }
  })

  socket.on('messages', (messages) => {
    model.setPage('contact')
    model.setMessages(messages)
    renderChat()
  })

  socket.on('groupMessages', (groupMessages) => {
    model.setPage('group')

    model.setGroupMessages(groupMessages)

    renderGroupChat()
  })

  socket.on('groupMessage', (groupMessage) => {
    const isSenderTheUser = groupMessage.sender === user._id

    const senderName = model.getGroupMessageSender(groupMessage.sender).name

    sendNotification(senderName, groupMessage.message, isSenderTheUser)

    if (model.isPage('contacts')) {
      socket.emit('contacts', user._id)
      return
    }

    if (!model.isPage('group')) return

    const prevMsg = model.getGroupMessages().at(-1)
    groupChat.addNewMessage({ msg: groupMessage, prevMsg })
    model.addGroupMessage(groupMessage)
    groupMessages.scrollBottom()
  })

  socket.on('pong', () => {
    setTimeout(() => {
      socket.emit('ping')
    }, 5000)
  })

  socket.emit('ping')

  addEvents()
}

init()

let notificationPermission = Notification.permission !== 'denied'
if (!notificationPermission) {
  Notification.requestPermission().then((perm) => {
    notificationPermission = Notification.permission !== 'denied'
  })
}

function sendNotification(sender, message, isSenderTheUser) {
  if (notificationPermission && !isSenderTheUser && document.hidden) {
    const notification = new Notification(sender, {
      body: message,
      icon: './boyonmoon.png',
    })
    notification.onclick = (event) => {
      event.preventDefault() // prevent the browser from focusing the Notification's tab
      window.open('https://daydreams.website/chat.html')
    }
  }
}
