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
    console.log("object");
    cb(null, false);
  }
};

const upload = multer({storage: fileStorage, fileFilter: fileFilter});

const router = express.Router();

router.post("/product", isAuth, upload.array('image', 6), productController.addNewProduct);

router.put("/product/:productId", isAuth, productController.updateProduct);

router.delete("/product/:productId", isAuth, productController.deleteProduct);

router.get("/product/:productId", isAuth, productController.getProductById);

router.get("/products", isAuth, productController.getProductByQuery);

module.exports = router;
