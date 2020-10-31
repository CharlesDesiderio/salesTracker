const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/users.js')
const users = express.Router()

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/')
  }
}

users.get('/login', (req, res) => {
  res.render('login.ejs')
})

users.post('/login', (req, res) => {
  User.findOne({
    username: req.body.username
  }, (err, foundUser) => {
    if (err) {
      res.send('DB error!')
    } else if (!foundUser) {
      res.send('User not found 🙁')
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser
        res.send('Login successful!')
      } else {
        res.send('Invalid password!')
      }
    }
  })
})

users.get('/new', (req, res) => {
  res.render('new.ejs')
})

users.post('/new', (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  User.create(req.body, (err, newUser) => {
    req.session.currentUser = req.body.username
    res.send(`Created! ${req.body.password}`)
  })
})

module.exports = users