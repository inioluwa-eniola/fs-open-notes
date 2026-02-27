const express = require('express')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

logger.info('connecting to', MONGODB_URI)

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { family: 4 })
    await logger.info('connected to MongoDB')
  }
  catch (error) {
    logger.error('error connecting to MongoDB:', error.message)    
  }
}

connectToDatabase()

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app