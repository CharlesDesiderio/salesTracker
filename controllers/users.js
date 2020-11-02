const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/users.js')
const Product = require('../models/products.js')
const users = express.Router()


const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/')
  }
}

users.get('/login', (req, res) => {
  res.render('user/login.ejs', {
    user: req.session.currentUser,
    err: req.session.err
  })
})

users.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send('Something went wrong')
    } else {
      res.redirect('/')
    }
  })
})

users.post('/login', (req, res) => {
  User.findOne({
    username: req.body.username
  }, (err, foundUser) => {
    if (err) {
      res.send('DB error!')
    } else if (!foundUser) {
      req.session.err = 'User not found'
      res.redirect('/users/login')
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser.username
        req.session.err = ''
        res.redirect('/users/profile')
      } else {
        req.session.err = 'Invalid password'
        res.redirect('/users/login')
      }
    }
  })
})

users.get('/new', (req, res) => {
  res.render('user/new.ejs')
})

users.post('/new', (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  User.create(req.body, (err, newUser) => {
    req.session.currentUser = req.body.username
    res.send(`Created! ${req.body.password}`)
  })
})

users.get('/profile', isAuthenticated, (req, res) => {
  Product.find({ ownerUsername: req.session.currentUser }, (err, foundProducts) => {
    res.render('user/profile.ejs', {
      products: foundProducts
    })
  })
})

module.exports = users