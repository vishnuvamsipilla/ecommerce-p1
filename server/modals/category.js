const mongoose = require("mongoose");

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

const categoryModal = mongoose.model("Category", schema);

module.exports = categoryModal;
