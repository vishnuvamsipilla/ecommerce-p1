const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getCategoriesController,
  addCategoryController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/category");
const router = express.Router();

router.get("/", getCategoriesController);
router.post("/", addCategoryController);
router.get("/:id", getCategoryController);

router.patch("/:id", authMiddleware, updateCategoryController);
router.delete("/:id", authMiddleware, deleteCategoryController);

module.exports = router;
