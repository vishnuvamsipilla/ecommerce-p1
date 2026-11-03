const mongoose = require("mongoose");

const validator = require("validator");

const schema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exists"],
      trim: true,
      minLength: [4, "Username is too short"],
      maxLength: [16, "Username is too long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [4, "Password is too short"],
      trim: true,
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "user"],
        message: "Please enter a valid role",
      },
      default: "user",
    },
    isEmailVerfied: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Please enter a valid status",
      },
      default: "active",
    },
  },
  { timestamps: true },
);

const userModal = mongoose.model("Users", schema);

module.exports = userModal;
