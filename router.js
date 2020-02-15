const { get_all, insert_object, update_object, delete_object, search_object } = require('./controller/objects')
const { auth_user } = require('./controller/middleware')

const router = (app) => {
  app.get('/', (req, res) => res.send("Welcome"))

  app.get('/api/objects', get_all)

  app.post('/api/object', insert_object)

  app.put('/api/object', update_object)

  app.delete('/api/object', delete_object)

  app.post('/api/objects', search_object)
}

module.exports = router;