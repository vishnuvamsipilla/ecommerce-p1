# Backend Architecture & Context (`server/`)

This document defines the backend architecture, database schemas, API contracts, and conventions for the e-commerce server.

---

## 1. Tech Stack Overview

| Technology | Role / Usage |
| :--- | :--- |
| **Node.js** | JavaScript runtime environment |
| **Express.js** | HTTP REST API framework |
| **MongoDB** | NoSQL document database |
| **Mongoose** | Object Data Modeling (ODM) library for MongoDB |
| **JSON Web Tokens (JWT)** | Stateless authentication tokens |
| **bcryptjs** | Secure password hashing |
| **CORS / Dotenv** | Cross-Origin Resource Sharing & Environment management |

---

## 2. Directory Structure Blueprint

```
server/
├── config/
│   └── db.js                  # Mongoose database connection logic
├── controllers/
│   ├── authController.js      # Customer & Admin authentication
│   ├── productController.js   # Product catalog & details
│   ├── categoryController.js  # Category listings
│   ├── cartController.js      # Shopping cart persistence
│   ├── orderController.js     # Checkout & customer orders
│   └── adminController.js     # Admin metrics, user list, inventory
├── models/
│   ├── User.js                # User accounts & roles (customer / admin)
│   ├── Product.js             # Product catalog, pricing, variants, stock
│   ├── Category.js            # Category hierarchy
│   ├── Order.js               # Order details, addresses, statuses
│   └── Cart.js                # User shopping cart items
├── routes/
│   ├── authRoutes.js          # /api/auth/*
│   ├── productRoutes.js       # /api/products/*
│   ├── categoryRoutes.js      # /api/categories/*
│   ├── cartRoutes.js          # /api/cart/*
│   ├── orderRoutes.js         # /api/orders/*
│   └── adminRoutes.js         # /api/admin/*
├── middlewares/
│   ├── authMiddleware.js      # Token verification (protect) & Admin guard (adminOnly)
│   ├── errorMiddleware.js     # Centralized error handler & 404 handler
│   └── validateMiddleware.js  # Request payload validation
├── utils/
│   ├── generateToken.js       # JWT signing helper
│   └── apiResponse.js         # Standardized JSON response formatting
├── .env.example               # Template for environment variables
├── server.js                  # Express app initialization & server entry point
└── package.json
```

---

## 3. Database Schemas (Mongoose Models)

### 3.1 `User` Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  addresses: [{
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    isDefault: { type: Boolean, default: false }
  }],
  timestamps: true
}
```

### 3.2 `Category` Model
```javascript
{
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive: { type: Boolean, default: true },
  timestamps: true
}
```

### 3.3 `Product` Model
```javascript
{
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, default: 0 }, // For discounts/sale tags
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, unique: true },
  variants: [{
    name: String,      // e.g. "Size", "Color"
    options: [String]  // e.g. ["S", "M", "L"] or ["Black", "White"]
  }],
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  timestamps: true
}
```

### 3.4 `Cart` Model
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    price: { type: Number, required: true },
    selectedVariant: { type: Map, of: String } // e.g. { size: "M", color: "Black" }
  }],
  timestamps: true
}
```

### 3.5 `Order` Model
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String }
  }],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: { type: String, default: 'COD' }, // e.g., 'Card', 'UPI', 'COD'
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paidAt: Date,
  deliveredAt: Date,
  timestamps: true
}
```

---

## 4. API Endpoints Map

### 4.1 Storefront & Customer APIs
* `POST /api/auth/register` — Register a customer account
* `POST /api/auth/login` — Login & receive JWT
* `GET  /api/auth/me` — Fetch authenticated customer profile (Protected)
* `GET  /api/products` — Catalog listing with pagination (`?page=1&limit=12`), sorting (`?sort=-price`), search (`?search=`), and category filter (`?category=`)
* `GET  /api/products/:id` — Single product details with populated category
* `GET  /api/categories` — Public categories list
* `GET  /api/cart` — Get logged-in user's cart (Protected)
* `POST /api/cart` — Add / sync item with cart (Protected)
* `DELETE /api/cart/:productId` — Remove item from cart (Protected)
* `POST /api/orders` — Create new order (Protected)
* `GET  /api/orders/my-orders` — List current customer's order history (Protected)

### 4.2 Admin Portal APIs (Protected: `protect` + `adminOnly`)
* `POST /api/admin/login` — Admin login
* `GET  /api/admin/analytics` — Summary stats (Total Sales, Revenue, Total Orders, Recent Orders, Stock Alerts)
* `GET  /api/admin/products` — Paginated product list for Ant Design Table
* `POST /api/admin/products` — Create new product
* `PUT  /api/admin/products/:id` — Update product details, pricing, stock
* `DELETE /api/admin/products/:id` — Delete product
* `GET  /api/admin/categories` — Category list for admin management
* `POST /api/admin/categories` — Create category
* `PUT  /api/admin/categories/:id` — Update category
* `DELETE /api/admin/categories/:id` — Delete category
* `GET  /api/admin/orders` — List all orders across all customers with filter by status
* `PUT  /api/admin/orders/:id/status` — Update order fulfillment status (`processing`, `shipped`, `delivered`, `cancelled`)
* `GET  /api/admin/customers` — List registered customers and order counts

---

## 5. Security & Authentication Conventions
1. **Password Security:** Hashes stored using `bcryptjs` with salt round >= 10. Passwords never returned in JSON queries (`select: false`).
2. **JWT Strategy:** Signed token containing `{ id: user._id, role: user.role }`, expires in 7 days or configured via `JWT_EXPIRES_IN`.
3. **Middleware Guards:**
   * `protect`: Verifies `Bearer <token>` in header and attaches `req.user`.
   * `adminOnly`: Ensures `req.user.role === 'admin'`.
4. **Standard Error Handler:** Catches Mongoose duplicate keys (E11000), validation errors, and CastErrors (invalid ObjectIds) and returns standard error responses.
