const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ownerUsername: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: String,
  originalUrl: String,
  tags: [String]
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product

