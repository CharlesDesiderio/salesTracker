// DEPENDENCIES
const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session')
const methodOverride = require("method-override");
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

// BASIC ROUTES
app.get("/", (req, res) => {
  res.send("Connection working");
});

app.get('/newUser', (req, res) => {
  res.render('new.ejs')
})

app.post('/newUser', (req, res) => {
  User.create(req.body, (err, newUser) => {
    res.send(`Created! ${req.body.displayName}`)
  })
})

// LISTENER
app.listen(PORT, () => {
  console.log(`Listening for connections on ${PORT}`);
});
