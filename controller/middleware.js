const redis = require('../util/redis')

const auth_user = (req, res, next) => {
  get_user(res, req.body.token, () => next())
}

const get_user = (res, token, callback) => {
  redis.get(token, (err, result) => {
    if (err) {
      res.status(401).send({
        error: "You need to login."
      })
    } else {
      callback(result)
    }
  })
}

module.exports = {
  auth_user,
  get_user
}