const app = require('./app')

const dotEnv = require('dotenv')

dotEnv.config({ path: './config.env' })

const mongoose = require('mongoose')
const { signIn } = require('./authController')

const DB = process.env.DB.replace(
  '<PASSWORD>',
  encodeURIComponent(process.env.DB_PASSWORD)
)
mongoose.connect(DB).then((err) => {
  console.log('DB connection successfull!')
})

const server = app.listen(3300, () => {
  console.log('server started!')
})
// process.on('uncaughtException', (err) => {
//   console.log(err)
//   // console.log('uncaughtException' + ' ' + err)
// })

// process.on('unhandledRejection', (err) => {
//   console.log(err)
//   // console.log('uncaughtException' + ' ' + err)
// })
