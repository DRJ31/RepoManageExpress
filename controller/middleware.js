const redis = require('../util/redis')

const auth_user = (req, res, next) => {
  let token = req.body.token || req.query.token
  get_user(res, `token_${token}`, () => next())
}

const get_user = (res, token, callback) => {
  redis.get(token, result => {
    if (!result) {
      res.status(401).send({error: "You need to login"})
    } else {
      callback(result)
    }
  })
}

module.exports = {
  auth_user,
  get_user
}