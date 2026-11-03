const express = require("express");
const {
  registrationController,
  loginController,
  getUserController,
} = require("../controllers/auth");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/login", (req, res) => {
  res.send("Login Requested ");
});

router.post("/register", registrationController);
router.post("/login", loginController);
router.get("/user", authMiddleware, getUserController);

module.exports = router;
