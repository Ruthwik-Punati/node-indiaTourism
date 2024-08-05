import { io } from 'socket.io-client'
console.log('web sockets')

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
const socket = io({ autoConnect: false })
const _id = user._id

socket.auth = { _id }
socket.connect()

navigator.serviceWorker.register(new URL('sw.js', import.meta.url))

const perm = await Notification.requestPermission()

function sendNotification(sender, message, groupName) {
  if (perm === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(
        `${groupName ? groupName + ' > ' : ''}${sender}`,
        {
          body: message,
          icon: 'boyonmoon.png',
          vibrate: [200, 100, 200, 100, 200, 100, 200],
        }
      )
    })
  }
}

function contactHandler(contactName) {
  if (model.getPage() === 'contact') return

  model.setSelectedContact(contactName)
  const selectedContact = model.getSelectedContact()

  socket.emit('messages', user._id, selectedContact.user._id)
}

function emitContacts() {
  if (model.getPage() === 'contacts') return

  model.setSelectedContact('')
  model.setSelectedGroup('')

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
  if (!message.trim()) return

  socket.emit('message', user._id, model.getSelectedContact().user._id, message)
}
function groupMessageHandler(groupMessage) {
  if (!groupMessage.trim()) return

  socket.emit(
    'groupMessage',
    user._id,
    model.getSelectedGroup()._id,
    groupMessage
  )
}

function addEvents() {
  // chat.toggleLightMode()
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

    const isSenderSelectedContact =
      model.getSelectedContact()?.user?._id === msg.sender

    if (!isSenderTheUser) {
      if (!isSenderSelectedContact || document.hidden) {
        sendNotification(senderName, msg.message)
      }
    }

    if (model.isPage('contacts')) {
      socket.emit('contacts', user._id)
      return
    }

    if (!model.isPage('contact')) return

    if (
      model.getSelectedContact()?.user?._id === msg.sender ||
      isSenderTheUser
    ) {
      const prevMsg = model.getMessages().at(-1)
      chat.addNewMessage({ msg, prevMsg })
      model.addMessage(msg)

      messages.scrollBottom()
    }
  })

  socket.on('groupMessage', (groupMessage) => {
    const isSenderTheUser = groupMessage.sender === user._id

    const senderName = model.getGroupMessageSender(groupMessage.sender).name

    const isGroupSelectedGroup = model.getSelectedGroup()

    if (!isSenderTheUser) {
      if (!isGroupSelectedGroup || document.hidden) {
        sendNotification(senderName, groupMessage.message, 'Dream Team')
      }
    }

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

  socket.on('pong', () => {
    setTimeout(() => {
      socket.emit('ping')
    }, 2000)
  })

  socket.emit('ping')

  socket.on('connect_error', () => {
    setTimeout(() => {
      socket.connect()
    }, 1000)
  })

  socket.on('reconnect', () => {
    console.log('reconnected')
  })
  socket.on('reconnect', () => {
    console.log('reconnect')
  })
  socket.io.on('reconnection_attempt', () => {
    console.log('reconnection attempted')
  })

  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect()
    }
    // else the socket will automatically try to reconnect
  })

  addEvents()
}

init()

window.history.pushState(null, null, window.location.href)
window.onpopstate = function () {
  window.history.go(1)
  emitContacts()
}

// setTimeout(() => {
//   alert(`Notification setting is ${perm}`)
// }, 1000)

// function sendNotification(sender, message, isSenderTheUser) {
//   if (notificationPermission && !isSenderTheUser && document.hidden) {
//     const notification = new Notification(sender, {
//       body: message,
//       icon: './boyonmoon.png',
//     })
//     notification.onclick = (event) => {
//       event.preventDefault() // prevent the browser from focusing the Notification's tab
//       window.open('https://daydreams.website/chat.html')
//     }
//   }
// }
