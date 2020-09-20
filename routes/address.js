const express = require("express");
const addressController = require("../controllers/address");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/address", isAuth, addressController.addNewAddress);

router.put("/address/:addressId", isAuth, addressController.updateAddress);

router.delete("/address/:addressId", isAuth, addressController.deleteAddress);

module.exports = router;