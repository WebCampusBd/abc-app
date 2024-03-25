const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const MongoStore = require("connect-mongo");
require("dotenv").config();

exports.createSession = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
    collectionName: "sessions",
  }),
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  next();
};

exports.registerUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      const userEmail = await User.findOne({ email: req.body.email });
      if (!userEmail) {
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
          });
          await newUser.save();
          res.redirect("/profile");
        });
      } else {
        res.render("error", { error: "Email already exist" });
      }
    } else {
      res.render("error", { error: "Username already exist" });
    }
  } catch (error) {
    res.render("error", { error: error });
  }
};

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

exports.logoutUser = (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updatePassword = (req, res) => {
  const { password } = req.body;
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (password.length > 0) {
      await User.updateOne({ _id: req.user._id }, { $set: { password: hash } });
      res.redirect("/profile");
    } else {
      res.redirect("/profile");
    }
  });
};

exports.updateEmail = async (req, res) => {
  const { email } = req.body;
  if (email.length > 0) {
    const user = await User.findOne({ email });
    if (!user) {
      await User.updateOne({ _id: req.user._id }, { $set: { email } });
      res.redirect("/profile");
    } else {
      res.render("error", { error: `${email} is already taken` });
    }
  } else {
    res.redirect("/profile");
  }
};

exports.updateUsername = async (req, res) => {
  const { username } = req.body;
  if (username.length > 0) {
    const user = await User.findOne({ username });
    if (!user) {
      await User.updateOne({ _id: req.user._id }, { $set: { username } });
      res.redirect("/profile");
    } else {
      res.render("error", { error: `${username} is already taken` });
    }
  } else {
    res.redirect("/profile");
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.user._id;
  await User.deleteOne({ _id: id });
  res.redirect("/");
};
