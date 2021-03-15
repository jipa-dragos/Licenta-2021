const jwt = require('jsonwebtoken')

const HttpError = require('../util/http-error')

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      throw new Error('Authentication failed!')
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    let userId
    if (decodedToken.studentId === undefined || decodedToken.studentId === null) {
      userId = decodedToken.professorId
    } else {
      userId = decodedToken.studentId
    }
    req.userData = { userId: userId }

    next()
  } catch (err) {
    const error = new HttpError('Authentication failed!', 403)
    return next(error)
  }
}
