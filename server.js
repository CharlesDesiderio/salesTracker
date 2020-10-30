// CONFIGURATION
require('dotenv').config()
const PORT = 3000//process.env.PORT
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')


// MIDDLEWARE
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.send('Connection working')
})

// LISTENER
app.listen(PORT, () => {
  console.log(`Listening for connections on ${PORT}`)
})