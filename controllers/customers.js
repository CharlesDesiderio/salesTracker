// DEPENDENCIES
const express = require('express')
const Customer = require('../models/customers.js')
// const Product = require('../models/products.js')
const User = require('../models/users.js')
const methodOverride = require('method-override')
const customers = express.Router()
customers.use(methodOverride('_method'))

// MIDDLEWARE
const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/')
  }
}

customers.get('/new', isAuthenticated, (req, res) => {
  res.render('customer/newCustomer.ejs')
})

customers.post('/new', (req, res) => {
  req.body.customerOf = req.session.currentUserId
  req.body.purchaseHistory = []
  Customer.create(req.body, (err, createdCustomer) => {
    res.send(createdCustomer)
  })
})

module.exports = customers