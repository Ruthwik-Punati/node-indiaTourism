const socketIO = require('socket.io')
const { setupMaster, setupWorker } = require('@socket.io/sticky')
const { createAdapter, setupPrimary } = require('@socket.io/cluster-adapter')
const Inbox = require('./models/chat/inboxModel')
const Message = require('./models/chat/messageModel')
const Group = require('./models/chat/groupModel')
const GroupMessages = require('./models/chat/groupMessageModel')

const generate = require('./ai/gemini')

const { createRoomId } = require('./helper')
const UserModel = require('./models/userModel')

const ioInit = function (server) {
  let io = socketIO(server)
  io.adapter(createAdapter())
  setupWorker(io)
  io.on('connection', (socket) => {
    console.log('New user connected')
    //emit message from server to user

    // listen for message from user
    socket.on('contacts', async (user) => {
      // fetch inbox and groups
      let [{ value: contactsInInbox }, { value: groups }] =
        await Promise.allSettled([
          Inbox.findOne({ user }).populate([
            { path: 'with.user', select: 'name _id' },
            { path: 'with.lastMsg' },
          ]),
          Group.find({ users: user }).populate([
            { path: 'lastMsg' },
            { path: 'users', select: 'name _id' },
          ]),
        ])

      // fetch users
      const condition = contactsInInbox.with.map((el) => {
        return { _id: { $ne: el.user._id } }
      })

      condition.push({ _id: { $ne: user } })
      let usersNotInContacts = await UserModel.find({
        $and: condition,
      }).select('_id name')
      usersNotInContacts = usersNotInContacts.map((el) => {
        return { user: el }
      })

      contactsInInbox.with = [...contactsInInbox.with, ...usersNotInContacts]

      const contacts = { ...contactsInInbox._doc, groups }

      socket.emit('contacts', contacts)
    })

    socket.on('groupMessages', async (group) => {
      const groupMessages = await GroupMessages.find({ group })

      socket.join(group)

      socket.emit('groupMessages', groupMessages)
    })

    socket.on('groupMessage', async (user, group, message) => {
      const msg = await GroupMessages.create({
        group,
        sender: user,
        message,
      })
      io.sockets.in(group).emit('groupMessage', msg)

      await Group.findByIdAndUpdate(group, { $set: { lastMsg: msg._id } })
    })

    socket.on('messages', async (user, chatWith) => {
      const query = {
        $or: [
          {
            $and: [{ sender: user }, { receiver: chatWith }],
          },
          {
            $and: [{ sender: chatWith }, { receiver: user }],
          },
        ],
      }
      const messages = await Message.find(query)

      socket.join(createRoomId(user, chatWith))

      socket.emit('messages', messages)
    })

    async function handleMessage(sender, receiver, message) {
      console.log(sender, receiver, message)
      console.log(process.env.GOOGLE_AI_ID)
      if (!process.env.GOOGLE_AI_ID) {
        return
      }
      const msg = await Message.create({ sender, receiver, message })

      io.sockets.in(createRoomId(sender, receiver)).emit('message', msg)

      if (receiver === `${process.env.GOOGLE_AI_ID}`) {
        const returnMsg = await generate(message)
        if (returnMsg) {
          handleMessage(receiver, sender, returnMsg)
          return
        }
      }
      const receiverInWith = await Inbox.findOne({
        $and: [{ user: sender }, { 'with.user': receiver }],
      })

      if (!receiverInWith) {
        await Promise.all([
          await Inbox.updateOne(
            { user: sender },
            { $push: { with: { user: receiver, lastMsg: msg._id } } }
          ),
          await Inbox.updateOne(
            { user: receiver },
            { $push: { with: { user: sender, lastMsg: msg._id } } }
          ),
        ])
      } else {
        await Promise.allSettled([
          await Inbox.updateOne(
            { user: sender, 'with.user': receiver },
            { $set: { 'with.$.lastMsg': msg._id } }
          ),
          await Inbox.updateOne(
            { user: receiver, 'with.user': sender },
            { $set: { 'with.$.lastMsg': msg._id } }
          ),
        ])
      }
    }

    socket.on('message', handleMessage)

    // when server disconnects from user
    socket.on('disconnect', () => {
      console.log('disconnected from user')
    })
  })
}

module.exports = ioInit
