const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username must be required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email must be required"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password must be required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
