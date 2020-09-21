const express = require("express");
const productController = require("../controllers/product");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/product", isAuth, productController.addNewProduct);

module.exports = router;
