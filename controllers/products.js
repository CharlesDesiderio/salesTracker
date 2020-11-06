// DEPENDENCIES
const express = require('express')
const User = require('../models/users.js')
const Product = require('../models/products.js')
const methodOverride = require('method-override')
const Customer = require('../models/customers.js')
const products = express.Router()
products.use(methodOverride('_method'))

// MIDDLEWARE
const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/')
  }
}

// ROUTES

// Display create new product form
products.get('/new', isAuthenticated, (req, res) => {
  res.render('product/newProduct.ejs', {
    currentUser: req.session.currentUser,
    currentUserId: req.session.currentUserId,
    currentUserDisplayName: req.session.currentUserDisplayName
  })
})

// Display individual product
products.get('/:id', isAuthenticated, (req, res) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    res.render('product/showProduct.ejs', {
      currentUser: req.session.currentUser,
      currentUserId: req.session.currentUserId,
      currentUserDisplayName: req.session.currentUserDisplayName,
      product: foundProduct,
    })
  })
})

// Update product
products.put('/:id', isAuthenticated, (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, (err, updatedProduct) => {
    res.redirect(`/products/${req.params.id}`)
  })
})

// Display product edit page
products.get('/:id/edit', isAuthenticated, (req, res) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    res.render('product/editProduct.ejs', {
      product: foundProduct,
      currentUser: req.session.currentUser,
      currentUserId: req.session.currentUserId,
      currentUserDisplayName: req.session.currentUserDisplayName
    })
  })
})

// Create new product
products.post('/new', isAuthenticated, (req, res) => {
  req.body.ownerUsername = req.session.currentUser
  Product.create(req.body, (err, createdProduct) => {
    res.redirect('/users/profile')
  })
})

// Delete product
products.delete('/:id', isAuthenticated, (req, res) => {
  Product.findByIdAndDelete(req.params.id, (err, deletedProduct) => {
    res.redirect('/users/profile')
  })
})

// Get create new purchase form
products.get('/newPurchase/:id', isAuthenticated, (req, res) => {
  Product.find({ ownerUsername: req.session.currentUser }, (err, foundProducts) => {
    Customer.findById(req.params.id, (err, foundCustomer) => {
      res.render('product/newPurchase.ejs', {
        customerId: req.params.id,
        products: foundProducts,
        customer: foundCustomer,
        currentUser: req.session.currentUser,
        currentUserId: req.session.currentUserId,
        currentUserDisplayName: req.session.currentUserDisplayName
      })
    })
  })
})

// Create new purchase
products.put('/newPurchase/:id', isAuthenticated, (req, res) => {
  req.body.datePurchased = Date.now()
  Product.findById(req.body.productId, (err, foundItem) => {
    req.body.purchasePrice = foundItem.price
    Customer.findByIdAndUpdate(req.params.id, { $push: { purchaseHistory: req.body } }, (err, foundCustomer) => {
      res.redirect('/users/profile')
    })
  })
})

module.exports = products