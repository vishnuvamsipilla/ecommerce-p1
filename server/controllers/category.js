const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const categoryModal = require("../modals/category.js");
const { StatusCodes } = require("http-status-codes");

const getCategoriesController = async (req, res) => {
  const categories = await categoryModal.find();
  if (categories) {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "categories fetched successfully",
      data: categories,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "categories fetch failed",
    });
  }
};

const addCategoryController = async (req, res) => {
  const body = req.body;
  const category = await categoryModal.create(body);
  if (category) {
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "category created successfully",
      data: category,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "category creation failed",
    });
  }
};

const getCategoryController = async (req, res) => {
  const { id } = req.params;
  const category = await categoryModal.findById(id);
  if (category) {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "category fetched successfully",
      data: category,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "category fetch failed",
    });
  }
};

const updateCategoryController = async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  const category = await categoryModal.findByIdAndUpdate(id, body, {
    new: true,
  });
  if (category) {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "category updated successfully",
      data: category,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "category update failed",
    });
  }
};

const deleteCategoryController = async (req, res) => {
  const { id } = req.params;
  const category = await categoryModal.findByIdAndDelete(id);
  if (category) {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "category deleted successfully",
      data: category,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "category deletion failed",
    });
  }
};

module.exports = {
  getCategoriesController,
  addCategoryController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
};
