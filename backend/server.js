const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')

// Load config.env
dotenv.config({ path: './config/config.env' })

// Connect to database
connectDB()

// Route files
const quiz = require('./routes/quiz-routes')
const answer = require('./routes/answer-routes')
const course = require('./routes/course-routes')
const auth = require('./routes/auth-routes')
const prof = require('./routes/professor-routes')

const app = express()

// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next()
})

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// Mount routers
app.use('/api/auth', auth)
app.use('/api/course', course)
app.use('/api/quiz', quiz)
app.use('/api/answer', answer)
app.use('/api/prof', prof)

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404)
  throw error
})

// app.use((error, req, res, next) => {

//   if (res.headerSent) {
//     return next(error)
//   }
//   res.status(error.code || 500)
//   res.json({ message: error.message || 'An unknown error occurred!' })
// })

const PORT = process.env.PORT || 5005

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.red
      .bold
  )
)

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.mesage}`.red)
  // Close server & exit process
  server.close(() => process.exit(1))
})
