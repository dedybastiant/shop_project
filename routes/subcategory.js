const express = require("express");
const subcategoryController = require("../controllers/subcategory");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/subcategory", isAuth, subcategoryController.AddNewSubcategory);

router.put("/subcategory/:subcategoryId", isAuth, subcategoryController.updateSubcategory);

module.exports = router;