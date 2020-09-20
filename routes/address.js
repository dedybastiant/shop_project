const express = require("express");
const addressController = require("../controllers/address");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/address", isAuth, addressController.addNewAddress);

// router.post("/login", addressController.login);

module.exports = router;