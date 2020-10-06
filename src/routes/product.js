const { body, param } = require("express-validator/check");
const express = require("express");
const productController = require("../controllers/product");
const isAuth = require("../middleware/auth");

const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

const router = express.Router();

router.post("/product", isAuth, upload.array("image", 6), [
	body("name").not().isEmpty().withMessage("Product Name can't be empty"),
	body("brand").not().isEmpty().withMessage("Product Brand can't be empty"),
	body("description").not().isEmpty().withMessage("Product Description can't be empty"),
	body("price").not().isEmpty().withMessage("Product Price can't be empty"),
	body("category").not().isEmpty().withMessage("Product Category can't be empty"),
	body("subcategory").not().isEmpty().withMessage("Product Subcategory can't be empty"),
	body("sku").not().isEmpty().withMessage("Product SKU can't be empty"),
	body("image").custom((value, {req}) => {
		if (req.files.length <= 0) {
			throw new Error("Product Image can't be empty");
		}
		return true;
	})
], productController.addNewProduct
);

router.put("/product/:productId", isAuth, [
	param("productId").isEmpty().withMessage("Product Id can't be empty"),
	body("name").not().isEmpty().withMessage("Product Name can't be empty"),
	body("brand").not().isEmpty().withMessage("Product Brand can't be empty"),
	body("description").not().isEmpty().withMessage("Product Description can't be empty"),
	body("price").not().isEmpty().withMessage("Product Price can't be empty"),
	body("category").not().isEmpty().withMessage("Product Category can't be empty"),
	body("subcategory").not().isEmpty().withMessage("Product Subcategory can't be empty"),
	body("sku").not().isEmpty().withMessage("Product SKU can't be empty"),
], productController.updateProduct);

router.delete("/product/:productId", isAuth, [
	param("productId").isEmpty().withMessage("Product Id can't be empty"),
],productController.deleteProduct);

router.get("/product/:productId", isAuth, [
	param("productId").isEmpty().withMessage("Product Id can't be empty"),
], productController.getProductById);

router.get("/products", isAuth, productController.getProductByQuery);

module.exports = router;
