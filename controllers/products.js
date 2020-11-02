const express = require('express')
const User = require('../models/users.js')
const Product = require('../models/products.js')
const methodOverride = require('method-override')
const products = express.Router()

products.use(methodOverride('_method'))

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.send('not authenticated')
  }
}

products.get('/', isAuthenticated, (req, res) => {
  res.send('showing products')
})

products.get('/new', isAuthenticated, (req, res) => {
  res.render('product/newProduct.ejs')
})

products.get('/:id', (req, res) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    res.render('product/showProduct.ejs', {
      product: foundProduct
    })
  })
})

products.put('/:id', isAuthenticated, (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, (err, updatedProduct) => {
    res.redirect(`/products/${req.params.id}`)
  })
})

products.get('/:id/edit', isAuthenticated, (req, res) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    res.render('product/editProduct.ejs', {
      product: foundProduct
    })
  })
})

products.post('/new', isAuthenticated, (req, res) => {
  req.body.ownerUsername = req.session.currentUser
  Product.create(req.body, (err, createdProduct) => {
    res.send(`Creates ${req.body.name} for ${req.body.ownerUsername}`)
  })
})

module.exports = products