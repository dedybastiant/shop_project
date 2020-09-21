const express = require("express");
const productController = require("../controllers/product");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/product", isAuth, productController.addNewProduct);

router.put("/product/:productId", isAuth, productController.updateProduct);

router.delete("/product/:productId", isAuth, productController.deleteProduct);

router.get("/product/:productId", isAuth, productController.getProductById);

router.get("/products", isAuth, productController.getProductByQuery);

module.exports = router;
