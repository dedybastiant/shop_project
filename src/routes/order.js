const express = require("express");
const orderController = require("../controllers/order");

const router = express.Router();

router.post("/order", orderController.createOrder);

router.get("/orders", orderController.getOrder);

router.get("/order/:orderId", orderController.getOrderById);

router.delete("/order:/orderId", orderController.calcenOrder);

module.exports = router;
