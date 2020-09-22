const express = require("express");
const subcategoryController = require("../controllers/subcategory");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/subcategory", isAuth, subcategoryController.AddNewSubcategory);

router.put("/subcategory/:subcategoryId", isAuth, subcategoryController.updateSubcategory);

router.delete("/subcategory/:subcategoryId", isAuth, subcategoryController.deleteSubcategory);

router.get("/subcategory/:subcategoryId", isAuth, subcategoryController.getSubcategoryById);

router.get("/subcategory", isAuth, subcategoryController.getSubcategoryByQuery);

module.exports = router;