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
    res.send('not authenticated')
  }
}

// // I...actually don't think I need this?
// products.get('/', isAuthenticated, (req, res) => {
//   res.send('showing products')
// })

// Display create new product form
products.get('/new', isAuthenticated, (req, res) => {
  res.render('product/newProduct.ejs')
})

// Display individual product
products.get('/:id', isAuthenticated, (req, res) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    res.render('product/showProduct.ejs', {
      product: foundProduct
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
      product: foundProduct
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

products.delete('/:id', isAuthenticated, (req, res) => {
  Product.findByIdAndDelete(req.params.id, (err, deletedProduct) => {
    res.redirect('/users/profile')
  })
})

products.get('/newPurchase/:id', isAuthenticated, (req, res) => {
  Product.find({ ownerUsername: req.session.currentUser }, (err, foundProducts) => {
    console.log(foundProducts)
    res.render('product/newPurchase.ejs', {
      customerId: req.params.id,
      products: foundProducts
    })
  })
})

products.put('/newPurchase/:id', isAuthenticated, (req, res) => {
  req.body.datePurchased = Date.now()
  Product.findById(req.body.productId, (err, foundItem) => {
    req.body.purchasePrice = foundItem.price
    Customer.findByIdAndUpdate(req.params.id, { $push: { purchaseHistory: req.body } }, (err, foundCustomer) => {
      console.log(req.body)
      res.redirect('/users/profile')
    })
  })
})

module.exports = products