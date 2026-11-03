# E-Commerce Platform - Project Overview & System Architecture

This root document serves as the high-level architecture guide and single source of truth for how the client and server connect within this project.

---

## 1. System Architecture

```
ecommerce-p1/
├── clinet/                    # Frontend Application (Storefront + Admin)
│   └── FRONTEND_CONTEXT.md    # Detailed Frontend Architecture & Guidelines
├── server/                    # Backend API Application (Express + MongoDB)
│   └── BACKEND_CONTEXT.md     # Detailed Backend Architecture & Guidelines
└── PROJECT_CONTEXT.md         # Root Monorepo Architecture (This file)
```

### Full-Stack Tech Stack Summary
| Tier | Technologies |
| :--- | :--- |
| **Frontend (`clinet/`)** | React 19, Vite, React Router, TanStack Query, Ant Design, SCSS Modules, Axios, React Hook Form |
| **Backend (`server/`)** | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs |

---

## 2. Functional Domains

The platform is split into two distinct user surfaces:

| Domain | Primary Users | Purpose & Core Capabilities |
| :--- | :--- | :--- |
| **Storefront** | Customers | Product discovery, search & filtering, collection browsing, product detail view (PDP), shopping cart, checkout, order history. |
| **Admin Portal** | Store Admins & Staff | Product CRUD, category hierarchy, inventory tracking, order status fulfillment, customer management, and analytical dashboards. |

---

## 3. Communication & API Conventions

Client-Server communication follows RESTful principles with standard JSON responses:

### 3.1 Standard API Response Structure
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### 3.2 Standard Error Response Structure
```json
{
  "success": false,
  "message": "Error description message",
  "errors": []
}
```

### 3.3 Authentication & Role Strategy
* **Roles:** `CUSTOMER` and `ADMIN`.
* **Token Strategy:** JWT (JSON Web Tokens) passed via HTTP `Authorization: Bearer <token>` header or HttpOnly cookies.
* **Role Enforcement:**
  * Storefront routes are accessible publicly; customer account/checkout require `CUSTOMER` authentication.
  * Admin APIs and routes require both authentication and an `ADMIN` role verification.

---

## 4. Sub-Documentation Links

For in-depth implementations and module details, refer to the dedicated context files:
* **Frontend Guide:** [clinet/FRONTEND_CONTEXT.md](file:///d:/vishnu/fs-pr-24-9/ecommerce-p1/clinet/FRONTEND_CONTEXT.md)
* **Backend Guide:** [server/BACKEND_CONTEXT.md](file:///d:/vishnu/fs-pr-24-9/ecommerce-p1/server/BACKEND_CONTEXT.md)

---

## 5. Monorepo Development Guidelines
1. **Frontend Dev Server:** Run inside `clinet/` with `npm run dev`. Do **not** run `npm run build` during daily development.
2. **Backend Dev Server:** Run inside `server/` with npm scripts (e.g. `npm run dev` or `nodemon`).
3. **Environment Isolation:** Keep `.env` files separated between `clinet/` (`VITE_API_BASE_URL`) and `server/` (`PORT`, `MONGO_URI` / `DATABASE_URL`, `JWT_SECRET`).
