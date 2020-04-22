import mongo from '../util/mongo'
import { ObjectId } from 'mongodb'

const get_all = (req, res) => {
  mongo.select('products', {
    name: {$type: 'string'},
    amount: {$type: 'number'}
  }, data => {
    mongo.select('products', {_keys: {$type: 'array'}}, keys => {
      res.send({
        data,
        keys: keys[0]._keys
      })
    })
  })
}

const insert_object = (req, res) => {
  mongo.select('products', {_keys: {$type: 'array'}}, (keys) => {
    const { data } = req.body
    const new_keys = req.body.keys
    const all_keys = keys[0]._keys
    for (let key of new_keys) {
      if (all_keys.indexOf(key) === -1) {
        all_keys.push(key)
      }
    }
    mongo.insert('products', data)
    mongo.update('products', {_keys: {$type: 'array'}}, {$set: {_keys: all_keys}})
    res.send({ message: "Successfully added object" })
  })
}

const update_object = (req, res) => {
  mongo.select('products', {_keys: {$type: 'array'}}, (keys) => {
    const { data, unset } = req.body
    const new_keys = req.body.keys
    const _id = data['_id']
    const all_keys = keys[0]._keys
    delete data['_id']
    for (let key of new_keys) {
      if (all_keys.indexOf(key) === -1) {
        all_keys.push(key)
      }
    }
    if (Object.keys(unset).length > 0) {
      mongo.update('products', {'_id': ObjectId(_id)}, {
        $set: data,
        $unset: unset
      })
    } else {
      mongo.update('products', {'_id': ObjectId(_id)}, { $set: data })
    }
    mongo.update('products', {_keys: {$type: 'array'}}, {$set: {_keys: all_keys}})
    res.send({ message: "Successfully updated" })
  })
}

const delete_object = (req, res) => {
  const _id = req.query.id
  mongo.select('products', {'_id': ObjectId(_id)}, doc => {
    if (doc.length > 0) {
      mongo.del('products', doc[0])
      res.send({ message: "Successfully deleted" })
    } else {
      res.status(500)
      res.send({ error: "Delete failed" })
    }
  })
}

const search_object = (req, res) => {
  const { key, val } = req.body
  if (typeof val === 'string' && val.replace(/\s+/g, "").length === 0) {
    res.send({ data: [] })
    return
  }

  const query = {}
  query[key] = typeof val === 'string' ? new RegExp(val, "i") : val
  mongo.select('products', query, data => {
    for (let i = 0; i < data.length; i++) {
      data[i]['_id'] = data[i]['_id'].toString()
    }
    res.send({ data })
  })
}

export default {
  get_all,
  insert_object,
  update_object,
  delete_object,
  search_object
}