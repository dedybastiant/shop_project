const express = require("express");
const categoryController = require("../controllers/category");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/category", isAuth, categoryController.AddNewCategory);

router.put("/category/:categoryId", isAuth, categoryController.updateCategory);

router.delete("/category/:categoryId", isAuth, categoryController.deleteCategory);

router.get("/category/:categoryId", isAuth, categoryController.getCategoryById);

module.exports = router;