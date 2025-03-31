const mongoose = require("../config/database");
const {Schema, model} = require("mongoose")

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "customer"], default: "customer" }, 
});

const User = model("User", userSchema);
module.exports = User;
