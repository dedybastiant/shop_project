const express = require("express");
const categoryController = require("../controllers/category");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/category", isAuth, categoryController.AddNewCategory);

module.exports = router;