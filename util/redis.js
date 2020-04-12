import redis from 'redis'
import assert from 'assert'

const set = (k, v, callback = () => {}) => {
  const client = redis.createClient()
  client.on("error", err => {
    console.log(err)
    callback(err)
    client.quit()
  })
  client.set(k, v)
  client.expire(k, 3600)
  client.quit()
  console.log(k, v)
  callback(null)
}

const get = (k, callback) => {
  const client = redis.createClient()
  client.on("error", err => {
    callback(err, null)
    client.quit()
  })
  client.get(k, (err, result) => {
    assert.equal(null, err)
    callback(result)
    client.quit()
  })
}

const del = (k, callback = () => {}) => {
  const client = redis.createClient()
  client.on("error", err => {
    callback(err)
    client.quit()
  })
  client.del(k)
  client.quit()
  callback(null)
}

export default { set, get, del }