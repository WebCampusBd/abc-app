const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
require("./config/passport");

const User = require("./models/users.model");
const {
  isLoggedIn,
  registerUser,
  isAuthenticated,
  logoutUser,
  updatePassword,
  updateEmail,
  updateUsername,
  deleteUser,
  createSession,
} = require("./controllers/users.controller");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.join(__dirname + "/public")));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session create
app.set("trust proxy", 1);
app.use(session(createSession));
app.use(passport.initialize());
app.use(passport.session());

// home route
app.get("/", isLoggedIn, (req, res) => {
  res.render("home");
});

// login
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/profile",
  })
);

// register route
app.get("/register", isLoggedIn, (req, res) => {
  res.render("register");
});
app.post("/register", isLoggedIn, registerUser);

// profile route
app.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.user });
});

//logout
app.get("/logout", logoutUser);

// update
app.get("/update", isAuthenticated, (req, res) => {
  res.render("update");
});

// update password
app.get("/password", isAuthenticated, (req, res) => {
  res.render("update-password");
});
app.post("/password", isAuthenticated, updatePassword);

// update email
app.get("/email", isAuthenticated, (req, res) => {
  res.render("update-email");
});
app.post("/email", isAuthenticated, updateEmail);

// update username
app.get("/username", isAuthenticated, (req, res) => {
  res.render("update-username");
});
app.post("/username", isAuthenticated, updateUsername);

// delete user
app.get("/delete", isAuthenticated, deleteUser);

// 404 handler
app.use((req, res, next) => {
  res.render("error", { error: "404 Not Found 😛" });
});

// server error handler
app.use((err, req, res, next) => {
  res.render("error", { error: "server error" });
});

module.exports = app;
