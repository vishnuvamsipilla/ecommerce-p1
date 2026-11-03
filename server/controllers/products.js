const productModal = require("../modals/product.js");
const { StatusCodes } = require("http-status-codes");

const getProductsController = async (req, res) => {
  const products = await productModal.find();
  if (products) {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "products fetched successfully",
      data: products,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "products fetch failed",
    });
  }
};

const addProductController = async (req, res) => {
  const body = req.body;
  const product = await productModal.create(body);
  if (product) {
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "product created successfully",
      data: product,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "product creation failed",
    });
  }
};

const getProductController = async (req, res) => {
  const { id } = req.params;
  const product = await productModal.findById(id);
  if (product) {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "product fetched successfully",
      data: product,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "product fetch failed",
    });
  }
};

const updateProductController = async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  const product = await productModal.findByIdAndUpdate(id, body, {
    new: true,
  });
  if (product) {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "product updated successfully",
      data: product,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "product update failed",
    });
  }
};

const deleteProductController = async (req, res) => {
  const { id } = req.params;
  const product = await productModal.findByIdAndDelete(id);
  if (product) {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "product deleted successfully",
      data: product,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "product deletion failed",
    });
  }
};

const searchProductController = async (req, res) => {
  const { limit, skip, sort, category, price } = req.body;

  let productQuery = productModal.find();
  if (limit !== undefined && skip !== undefined) {
    productQuery = productQuery.skip(Number(skip)).limit(Number(limit));
  }
  if (sort !== undefined) {
    productQuery = productQuery.sort({
      [sort.fieldname]: Number(sort.value),
    });
  }
  if (price !== undefined) {
    const { minPrice, maxPrice } = price;
    if (minPrice !== undefined && maxPrice !== undefined) {
      productQuery = productQuery.where("price").gte(minPrice).lte(maxPrice);
    } else if (minPrice !== undefined) {
      productQuery = productQuery.where("price").gte(minPrice);
    } else if (maxPrice !== undefined) {
      productQuery = productQuery.where("price").lte(maxPrice);
    }
  }

  if (category !== undefined) {
    productQuery = productQuery.where("category").equals(category);
  }
  const product = await productQuery;
  if (product) {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "product fetched successfully",
      data: product,
      length: product.length,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "product fetch failed",
    });
  }
};

module.exports = {
  getProductsController,
  addProductController,
  getProductController,
  updateProductController,
  deleteProductController,
  searchProductController,
};
