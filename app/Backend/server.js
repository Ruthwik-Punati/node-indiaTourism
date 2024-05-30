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

const port = 8000

const server = app.listen(port, () => {
  console.log(`server started on port ${port}`)
})
// process.on('uncaughtException', (err) => {
//   console.log(err)
//   // console.log('uncaughtException' + ' ' + err)
// })

// process.on('unhandledRejection', (err) => {
//   console.log(err)
//   // console.log('uncaughtException' + ' ' + err)
// })
