// DEPENDENCIES
const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/users.js')
const Product = require('../models/products.js')
const methodOverride = require('method-override')
const Customer = require('../models/customers.js')
const users = express.Router()

users.use(methodOverride('_method'))

// MIDDLEWARE
const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/')
  }
}

// Display Login Page
users.get('/login', (req, res) => {
  res.render('user/login.ejs', {
    currentUser: req.session.currentUser,
    err: req.session.err
  })
})

// Logout, redirect to root
users.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send('Something went wrong')
    } else {
      res.redirect('/')
    }
  })
})

// Login attempt
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
        req.session.currentUserId = foundUser._id
        req.session.err = ''
        res.redirect('/users/profile')
      } else {
        req.session.err = 'Invalid password'
        res.redirect('/users/login')
      }
    }
  })
})

// Display create new user form
users.get('/new', (req, res) => {
  res.render('user/new.ejs', {
    currentUser: req.session.currentUser,
    err: req.session.err
  })
})

// Create new user
users.post('/new', (req, res) => {
  User.find({ username: req.body.username }, (err, foundUser) => {
    if (foundUser.length > 0) {
      req.session.err = 'Username already exists'
      res.redirect('/users/new')
    } else {
      req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      User.create(req.body, (err, newUser) => {
        req.session.currentUser = req.body.username
        res.send(`Created! ${req.body.username}`)
      })
    }
  })
})

// View user profile
users.get('/profile', isAuthenticated, (req, res) => {
  Product.find({ ownerUsername: req.session.currentUser }, (err, foundProducts) => {
    
    Customer.find({ customerOf: req.session.currentUserId }, (err, foundCustomers) => {

      res.render('user/profile.ejs', {
        products: foundProducts,
        customers: foundCustomers,
        currentUser: req.session.currentUser
      })
    })
    
  })
})

users.get('/:id/edit', isAuthenticated, (req, res) => {
  User.find({ username: req.params.id }, (err, foundUser) => {
    console.log(foundUser)
    res.render('user/editUser.ejs', {
      currentUser: req.session.currentUser,
      user: foundUser
    })
  })
})

users.put('/:id', isAuthenticated, (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, (err, updatedUser) => {
    console.log(`Updated ${updatedUser}`)
    res.redirect('/users/profile')
  })
})

module.exports = users