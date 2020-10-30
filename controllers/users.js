const express = require('express')
const User = require('../models/users.js')
const users = express.Router()

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/')
  }
}


users.get('/new', (req, res) => {
  res.render('new.ejs')
})

users.post('/new', (req, res) => {
  User.create(req.body, (err, newUser) => {
    res.send(`Created! ${req.body.displayName}`)
  })
})

module.exports = users