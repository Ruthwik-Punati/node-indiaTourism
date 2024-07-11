const redis = require('redis')
const client = redis.createClient({
  url: 'redis://127.0.0.1:6379',
})

const init = async () => {
  client.on('connect', function () {
    console.log('Redis connected')
  })

  await client.connect()
}
init()

module.exports = client
