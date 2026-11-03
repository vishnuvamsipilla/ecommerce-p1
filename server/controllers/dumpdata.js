const categoryModal = require("../modals/category.js");
const productModal = require("../modals/product.js");

const categories = [
  {
    name: "Men's Shirts",
    description: "Formal, casual, and linen shirts for men",
    slug: "/mens-shirts",
    status: "active",
  },
  {
    name: "Men's T-Shirts",
    description: "Everyday polo and graphic t-shirts for men",
    slug: "/mens-t-shirts",
    status: "active",
  },
  {
    name: "Men's Bottoms",
    description: "Jeans and chinos for everyday wear",
    slug: "/mens-bottoms",
    status: "active",
  },
  {
    name: "Men's Outerwear",
    description: "Sweatshirts and jackets for cooler days",
    slug: "/mens-outerwear",
    status: "active",
  },
];

const products = [
  {
    name: "Classic Cotton Shirt",
    description: "Comfortable regular-fit cotton shirt for men",
    slug: "/classic-cotton-shirt",
    images: [],
    categorySlug: "/mens-shirts",
    price: 29,
    stock: 120,
    status: "active",
    sku: "SKU-MEN-SHIRT-001",
  },
  {
    name: "Slim Fit Formal Shirt",
    description: "Slim fit formal shirt suitable for office wear",
    slug: "/slim-fit-formal-shirt",
    images: [],
    categorySlug: "/mens-shirts",
    price: 35,
    stock: 75,
    status: "active",
    sku: "SKU-MEN-SHIRT-002",
  },
  {
    name: "Casual Denim Shirt",
    description: "Premium denim shirt for casual occasions",
    slug: "/casual-denim-shirt",
    images: [],
    categorySlug: "/mens-shirts",
    price: 42,
    stock: 48,
    status: "active",
    sku: "SKU-MEN-SHIRT-003",
  },
  {
    name: "Classic Polo T-Shirt",
    description: "Cotton polo t-shirt with a comfortable fit",
    slug: "/classic-polo-tshirt",
    images: [],
    categorySlug: "/mens-t-shirts",
    price: 24,
    stock: 150,
    status: "active",
    sku: "SKU-MEN-TSHIRT-001",
  },
  {
    name: "Oversized Graphic T-Shirt",
    description: "Trendy oversized t-shirt with graphic print",
    slug: "/oversized-graphic-tshirt",
    images: [],
    categorySlug: "/mens-t-shirts",
    price: 27,
    stock: 90,
    status: "active",
    sku: "SKU-MEN-TSHIRT-002",
  },
  {
    name: "Regular Fit Chinos",
    description: "Comfortable cotton chinos for everyday wear",
    slug: "/regular-fit-chinos",
    images: [],
    categorySlug: "/mens-bottoms",
    price: 45,
    stock: 60,
    status: "active",
    sku: "SKU-MEN-CHINO-001",
  },
  {
    name: "Slim Fit Jeans",
    description: "Stretchable slim-fit denim jeans",
    slug: "/slim-fit-jeans",
    images: [],
    categorySlug: "/mens-bottoms",
    price: 55,
    stock: 35,
    status: "active",
    sku: "SKU-MEN-JEANS-001",
  },
  {
    name: "Premium Linen Shirt",
    description: "Breathable linen shirt designed for summer",
    slug: "/premium-linen-shirt",
    images: [],
    categorySlug: "/mens-shirts",
    price: 49,
    stock: 25,
    status: "active",
    sku: "SKU-MEN-SHIRT-004",
  },
  {
    name: "Hooded Sweatshirt",
    description: "Warm cotton-blend hooded sweatshirt",
    slug: "/hooded-sweatshirt",
    images: [],
    categorySlug: "/mens-outerwear",
    price: 60,
    stock: 15,
    status: "active",
    sku: "SKU-MEN-HOODIE-001",
  },
  {
    name: "Leather Jacket",
    description: "Premium casual leather jacket",
    slug: "/leather-jacket",
    images: [],
    categorySlug: "/mens-outerwear",
    price: 150,
    stock: 8,
    status: "active",
    sku: "SKU-MEN-JACKET-001",
  },
  {
    name: "Classic White Shirt",
    description: "Essential white shirt for formal and casual wear",
    slug: "/classic-white-shirt",
    images: [],
    categorySlug: "/mens-shirts",
    price: 32,
    stock: 0,
    status: "active",
    sku: "SKU-MEN-SHIRT-005",
  },
  {
    name: "Old Style Shirt",
    description: "Discontinued mens shirt",
    slug: "/old-style-shirt",
    images: [],
    categorySlug: "/mens-shirts",
    price: 20,
    stock: 5,
    status: "inactive",
    sku: "SKU-MEN-SHIRT-006",
  },
];

const seedProducts = async () => {
  const savedCategories = await Promise.all(
    categories.map((category) =>
      categoryModal.findOneAndUpdate({ slug: category.slug }, category, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }),
    ),
  );
  const categoryIds = new Map(
    savedCategories.map((category) => [category.slug, category._id]),
  );

  await productModal.bulkWrite(
    products.map(({ categorySlug, ...product }) => ({
      updateOne: {
        filter: { sku: product.sku },
        update: { ...product, category: categoryIds.get(categorySlug) },
        upsert: true,
      },
    })),
  );

  console.log("Categories and products seeded successfully");
};

module.exports = { seedProducts };
