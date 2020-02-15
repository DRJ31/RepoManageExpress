const redis = require('redis')

const set = (k, v, callback) => {
  const client = redis.createClient()
  client.on("error", err => {
    callback(err)
    client.quit()
  })
  client.set(k, v)
  client.quit()
  callback(null)
}

const get = (k, callback) => {
  const client = redis.createClient()
  client.on("error", err => {
    callback(err, null)
    client.quit()
  })
  client.get(k, (err, result) => {
    err ? callback(err, null) : callback(null, result.toString())
    client.quit()
  })
}

module.exports = { set, get }