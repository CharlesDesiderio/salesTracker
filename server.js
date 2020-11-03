// DEPENDENCIES
const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session')
const methodOverride = require("method-override");
const bcrypt = require('bcrypt')
const User = require("./models/users");

// CONFIGURATION
require("dotenv").config();
const PORT = process.env.PORT;
const app = express();
const db = mongoose.connection
const mongoConnection = `${process.env.MONGO_URI}/salesTracker`

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// DATABASE CONNECTION
mongoose.connect(mongoConnection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, () => {
  console.log(`Connected to MONGODB at ${mongoConnection}`)
})

// CONTROLLERS
const userController = require('./controllers/users.js')
app.use('/users', userController)

const productController = require('./controllers/products.js')
app.use('/products', productController)

const customerController = require('./controllers/customers.js')
app.use('/customers', customerController)



// BASIC ROUTES
app.get("/", (req, res) => {
  res.render('index.ejs', {
    user: req.session.currentUser || false
  })
});


// LISTENER
app.listen(PORT, () => {
  console.log(`Listening for connections on ${PORT}`);
});
