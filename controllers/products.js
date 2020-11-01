const express = require('express')
const User = require('../models/users.js')
const Product = require('../models/products.js')
const products = express.Router()

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
  res.render('user/newProduct.ejs')
})

products.post('/new', isAuthenticated, (req, res) => {
  req.body.ownerUsername = req.session.currentUser
  Product.create(req.body, (err, createdProduct) => {
    res.send(`Creates ${req.body.name} for ${req.body.ownerUsername}`)
  })
})

module.exports = products