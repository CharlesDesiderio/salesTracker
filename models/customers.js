const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: String,
  email: String,
  phone: String,
  purchaseHistory: [{
    productId: {
      type: String,
      required: true
    },
    datePurchased: {
      type: String,
      required: true
    },
    purchasePrice: {
      type: Number,
      required: true
    },
    purchaseQuantity: {
      type: Number,
      required: true
    }
  }]
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer
