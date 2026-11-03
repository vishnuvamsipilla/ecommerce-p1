const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const rateLimit = require("express-rate-limit");

const app = express();

const RateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(cors());
const authRouter = require("./routes/auth.js");
const categoryRouter = require("./routes/category.js");
const productRouter = require("./routes/products.js");
const globalErrorHanler = require("./middlewares/errorHandler.js");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());

app.use("/auth", RateLimiter, authRouter);
app.use("/categories", categoryRouter);
app.use("/products", RateLimiter, productRouter);
app.use(globalErrorHanler);

module.exports = app;
