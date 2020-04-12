import redis from '../util/redis'

export const auth_user = (req, res, next) => {
  let token = req.body.token || req.query.token
  get_user(res, `token_${token}`, () => next())
}

export const get_user = (res, token, callback) => {
  redis.get(token, result => {
    if (!result) {
      res.status(401).send({error: "You need to login"})
    } else {
      callback(result)
    }
  })
}