const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect('mongodb+srv://my_user:cqctTpA44PUI771S@cluster0.6u5nhwv.mongodb.net/?appName=Cluster0', { family: 4 })
  .then(() => {
    console.log('connected successfully')
    mongoose.connection.close()
  })
  .catch((error) => {
    console.log('connection failed', error.message)
  })