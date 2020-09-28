const express = require("express");
const cartController = require("../controllers/cart");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/cart", isAuth, cartController.addToCart);

router.put("/cart", isAuth, cartController.updateCart);

router.delete("/cart/:cartId", isAuth, cartController.deleteCartItem);

router.get("/cart/:cartId", isAuth, cartController.getCartById);

router.get("/cart/", isAuth, cartController.getCartByQuery);

module.exports = router;