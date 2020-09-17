const express = require("express");
const userController = require("../controllers/user");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.put("/user", isAuth, userController.updateUser);

router.put("/user/change-password", isAuth, userController.changePassword);

module.exports = router;
