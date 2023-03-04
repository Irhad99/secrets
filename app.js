require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Povezivanje baze
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/userDB");

// Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Model (kolekcija)
const User = new mongoose.model("User", userSchema);

//--------------------------TODO----------------------------//

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });

    newUser
      .save()
      .then(() => {
        res.render("secrets");
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result) res.render("secrets");
        });
      }
    })
    .catch((error) => {
      console.log(err);
      res.send(400, "Bad Request");
    });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
