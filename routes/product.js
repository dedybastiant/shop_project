const express = require("express");
const productController = require("../controllers/product");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/product", isAuth, productController.addNewProduct);

router.put("/product/:productId", isAuth, productController.updateProduct);

module.exports = router;
