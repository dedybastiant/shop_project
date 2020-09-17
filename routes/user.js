const express = require("express");
const userController = require("../controllers/user");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.put("/user", isAuth, userController.updateUser);

module.exports = router;
