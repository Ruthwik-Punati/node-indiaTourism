const app = require('./app')
const socketIO = require('socket.io')
const dotEnv = require('dotenv')

dotEnv.config({ path: './config.env' })

const mongoose = require('mongoose')

const DB = process.env.DB.replace(
  '<PASSWORD>',
  encodeURIComponent(process.env.DB_PASSWORD)
)
mongoose.connect(DB).then((err) => {
  console.log('DB connection successfull!')
})

const cluster = require('cluster')
const Inbox = require('./models/chat/inboxModel')
const Message = require('./models/chat/messageModel')
const Group = require('./models/chat/groupModel')
const GroupMessages = require('./models/chat/groupMessageModel')

const { createRoomId } = require('./helper')
const UserModel = require('./models/userModel')

const numCPUs = require('os').cpus().length
// const process = require('process')
const port = 8000

// cluster.schedulingPolicy = cluster.SCHED_RR
// if (cluster.isMaster) {
//   console.log(`Primary ${process.pid} is running`)

//   // one time things

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork()
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`)
//     cluster.fork()
//   })
// } else {
//   // Workers can share any TCP connection
//   // In this case it is an HTTP server
//   const server = app.listen(port, () => {
//     console.log(`server started on port ${port} on worker  ${process.pid}`)
//   })
//   server.on('request', () => {
//     console.log(`request handled by ${process.pid}`)
//     // cluster.worker.kill()
//   })
// }

const server = app.listen(port, () => {
  console.log(`server started on port ${port} on worker  ${process.pid}`)
})

let io = socketIO(server)

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
    let msg = {
      group,
      sender: user,
      message,
    }
    io.sockets.in(group).emit('groupMessage', msg)
    msg = await GroupMessages.create(msg)

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

  socket.on('message', async (sender, receiver, message) => {
    const msg = await Message.create({ sender, receiver, message })
    io.sockets.in(createRoomId(sender, receiver)).emit('message', msg)
    const receiverInWith = await Inbox.findOne({
      $and: [{ user: sender }, { 'with.user': receiver }],
    })

    if (!receiverInWith) {
      await Inbox.updateOne(
        { user: sender },
        { $push: { with: { user: receiver, lastMsg: msg._id } } }
      )

      await Inbox.updateOne(
        { user: receiver },
        { $push: { with: { user: sender, lastMsg: msg._id } } }
      )
    } else {
      await Inbox.updateMany(
        {
          $or: [{ user: sender }, { user: receiver }],

          $or: [{ 'with.user': sender }, { 'with.user': receiver }],
        },
        { $set: { 'with.$.lastMsg': msg._id } }
      )
    }
  })

  // when server disconnects from user
  socket.on('disconnect', () => {
    console.log('disconnected from user')
  })
})

process.on('uncaughtException', (err) => {
  console.log('uncaughtException' + ' ' + err)
})

process.on('unhandledRejection', (err) => {
  console.log('uncaughtException' + ' ' + err)
})

module.exports = server
