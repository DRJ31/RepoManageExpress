import objects from './controller/objects'
import { auth_user } from './controller/middleware'
import user from './controller/user'
import express from 'express'

const router = (app) => {
  const manage = express()
  app.use('/api/m', manage)
  manage.use(auth_user)

  app.get('/', (req, res) => res.send("Welcome"))

  app.get('/api/objects', objects.get_all)

  app.post('/api/objects', objects.search_object)

  app.post('/api/user', user.login)

  app.post('/api/register', user.register)

  manage.post('/object', objects.insert_object)

  manage.put('/object', objects.update_object)

  manage.delete('/object', objects.delete_object)

  manage.post('/user', user.check_user)

  manage.put('/password', user.change_password)

  manage.post('/logout', user.logout)
}

export default router