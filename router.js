const { get_all, insert_object, update_object, delete_object, search_object } = require('./controller/objects')
const { auth_user } = require('./controller/middleware')
const { logout, login, register, check_user, change_password } = require('./controller/user')
const express = require('express')

const router = (app) => {
  const manage = express()
  app.use('/api/m', manage)
  manage.use(auth_user)

  app.get('/', (req, res) => res.send("Welcome"))

  app.get('/api/objects', get_all)

  app.post('/api/objects', search_object)

  app.post('/api/user', login)

  app.post('/api/register', register)

  manage.post('/object', insert_object)

  manage.put('/object', update_object)

  manage.delete('/object', delete_object)

  manage.post('/user', check_user)

  manage.put('/password', change_password)

  manage.post('/logout', logout)
}

module.exports = router