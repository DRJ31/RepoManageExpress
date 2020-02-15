const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = "mongodb://127.0.0.1:27017"
const DATABASE = "manage"

const connectDB = (callback) => {
  MongoClient.connect(url).then(callback).catch(err => assert.equal(err, null))
}

const select = (name, query, callback) => {
  connectDB(client => {
    const collection = client.db(DATABASE).collection(name)
    collection.find(query).toArray((err, docs) => {
      assert.equal(err, null)
      callback(docs)
      client.close()
    })
  })
}

const insert = (name, data, callback = () => {}) => {
  connectDB(client => {
    const collection = client.db(DATABASE).collection(name)
    collection.insertMany([data], (err, result) => {
      assert.equal(err, null)
      assert.equal(1, result.result.n)
      assert.equal(1, result.ops.length)
      callback(result)
      client.close()
    })
  })
}

const update = (name, query, data, callback = () => {}) => {
  connectDB(client => {
    const collection = client.db(DATABASE).collection(name)
    collection.updateOne(query, data, (err, result) => {
      assert.equal(err, null)
      assert.equal(1, result.result.n)
      callback(result)
      client.close()
    })
  })
}

const del = (name, query, callback = () => {}) => {
  connectDB(client => {
    const collection = client.db(DATABASE).collection(name)
    collection.deleteOne(query, (err, result) => {
      assert.equal(err, null)
      assert.equal(1, result.result.n)
      callback(result)
      client.close()
    })
  })
}

module.exports = {
  select,
  insert,
  update,
  del
}
