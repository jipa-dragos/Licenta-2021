const HttpError = require('../util/http-error')

const errorResponse = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log to console for the developer
  console.log(err)

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`
    error = new HttpError(message, 404)
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = new HttpError(message, 400)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message)
    error = new HttpError(message, 400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error',
  })
}

module.exports = errorResponse
