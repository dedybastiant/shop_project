const express = require("express");
const cartController = require("../controllers/cart");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/cart", isAuth, cartController.addToCart);

module.exports = router;