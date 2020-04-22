import uuidv4 from 'uuid/v4'
import mongo from '../util/mongo'
import redis from '../util/redis'
import { CODE } from '../util/config'

const login = (req, res) => {
  const { username, password } = req.body
  mongo.select('users', { username, password }, user => {
    if (user.length < 1) {
      res.status(401)
      res.send({ error: "Wrong username or password" })
      return
    }
    const token = uuidv4()
    const current = user[0]
    redis.set(`token_${token}`, current.username)
    res.send({
      token,
      username: current.username
    })
  })
}

const check_user = (req, res) => {
  const { token } = req.body
  redis.get(`token_${token}`, username => {
    if (!username) {
      res.status(401)
      res.send({ error: "User session expired" })
    } else {
      res.send({ username })
    }
  })
}

const logout = (req, res) => {
  const { token } = req.body
  redis.del(`token_${token}`)
  res.send({ message: "Logout succeeded" })
}

const register = (req, res) => {
  const { username, password, code } = req.body
  if (code !== CODE) {
    res.status(401)
    res.send({ error: "Wrong invitation code" })
    return
  }
  mongo.select('users', { username }, user => {
    if (user.length > 0) {
      res.status(401)
      res.send({ error: "Username existed" })
      return
    }
    mongo.insert('users', { username, password })
    res.send({ message: "Successfully registered" })
  })
}

const change_password = (req, res) => {
  const { token, old_pass, new_pass } = req.body
  redis.get(`token_${token}`, username => {
    mongo.select('users', { username }, user => {
      if (user[0].password !== old_pass) {
        res.status(403)
        res.send({ error: "The old password is incorrect" })
        return
      }
      mongo.update('users', user[0], { $set: { password: new_pass } })
      res.send({ message: "Successfully changed password" })
    })
  })
}

export default {
  login,
  logout,
  register,
  check_user,
  change_password
}