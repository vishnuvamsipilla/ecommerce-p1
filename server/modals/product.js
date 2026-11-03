const mongoose = require("mongoose");
const crypto = require("crypto");

const validator = require("validator");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "slug is required"],
      trim: true,
      unique: true,
    },

    images: {
      type: [String],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price must be greater than or equal to 0"],
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      immutable: true,
      default: () =>
        `SKU-${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`,
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

const productModal = mongoose.model("Product", schema);

module.exports = productModal;
