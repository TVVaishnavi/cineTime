const mongoose = require("../config/database");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "customer"], default: "customer" }, // Role field
});

const User = mongoose.model("User", userSchema);
module.exports = User;
