const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getProductsController,
  addProductController,
  getProductController,
  updateProductController,
  deleteProductController,
  searchProductController,
} = require("../controllers/products");
const router = express.Router();

router.get("/", getProductsController);
router.post("/", addProductController);
router.get("/:id", getProductController);

router.post("/search", searchProductController);

router.patch("/:id", authMiddleware, updateProductController);
router.delete("/:id", authMiddleware, deleteProductController);

module.exports = router;
