// DEPENDENCIES
const express = require('express')
const Customer = require('../models/customers.js')
// const Product = require('../models/products.js')
const User = require('../models/users.js')
const methodOverride = require('method-override')
const Product = require('../models/products.js')
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
  res.render('customer/newCustomer.ejs', {
    currentUser: req.session.currentUser,
    currentUserDisplayName: req.session.currentUserDisplayName,
    currentUserId: req.session.currentUserId
  })
})

customers.post('/new', (req, res) => {
  req.body.customerOf = req.session.currentUserId
  req.body.purchaseHistory = []
  Customer.create(req.body, (err, createdCustomer) => {
    res.redirect('/users/profile')
  })
})

customers.get('/:id', isAuthenticated, (req, res) => {
  Product.find({ ownerUsername: req.session.currentUser }, (err, foundProducts) => {
    Customer.findById(req.params.id, (err, foundCustomer) => {
      res.render('customer/viewCustomer.ejs', {
        customer: foundCustomer,
        products: foundProducts,
        currentUser: req.session.currentUser,
        currentUserDisplayName: req.session.currentUserDisplayName,
        currentUserId: req.session.currentUserId
      })
    })
  })
})

customers.get('/:id/edit', isAuthenticated, (req, res) => {
  Customer.findById(req.params.id, (err, foundCustomer) => {
    res.render('customer/editCustomer.ejs', {
      currentUser: req.session.currentUser,
      currentUserDisplayName: req.session.currentUserDisplayName,
      currentUserId: req.session.currentUserId,
      customer: foundCustomer
    })
  })
})

customers.delete('/:id', isAuthenticated, (req, res) => {
  Customer.findByIdAndDelete(req.params.id, (err, foundCustomer) => {
    res.redirect('/users/profile')
  })
})

customers.put('/:id', isAuthenticated, (req, res) => {
  req.body.customerOf = req.session.currentUserId
  Customer.findByIdAndUpdate(req.params.id, req.body, (err, foundCustomer) => {
    res.redirect('/users/profile')
  })
})

module.exports = customers