const dotEnv = require('dotenv')
dotEnv.config({ path: './config.env' })
const app = require('./app')
const ioInit = require('./socket')

const { setupMaster, setupWorker } = require('@socket.io/sticky')
const { createAdapter, setupPrimary } = require('@socket.io/cluster-adapter')

const mongoose = require('mongoose')

const DB = process.env.DB.replace(
  '<PASSWORD>',
  encodeURIComponent(process.env.DB_PASSWORD)
)
mongoose.connect(DB).then((err) => {
  console.log('DB connection successfull!')
})

const cluster = require('cluster')
const numCPUs = require('os').cpus().length

process.on('uncaughtException', (err) => {
  console.log('uncaughtException' + ' ' + err)
})

process.on('unhandledRejection', (err) => {
  console.log('uncaughtException' + ' ' + err)
})

const port = 441

// cluster.schedulingPolicy = cluster.SCHED_RR
if (cluster.isMaster) {
  console.log(`Primary ${process.pid} is running`)

  // setup sticky sessions
  setupMaster(app, {
    loadBalancingMethod: 'random',
  })

  // setup connections between the workers
  setupPrimary()

  // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
  // Node.js < 16.0.0
  cluster.setupMaster({
    serialization: 'advanced',
  })

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
    cluster.fork()
  })
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  const server = app.listen(port, () => {
    console.log(`server started on port ${port} on worker  ${process.pid}`)
  })
  ioInit(server)
  server.on('request', () => {
    console.log(`request handled by ${process.pid}`)
    // cluster.worker.kill()
  })
}
