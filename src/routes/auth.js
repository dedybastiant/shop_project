const { body, check } = require("express-validator/check");
const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.post(
  "/signup",[
    body("email")
      .not().isEmpty().withMessage("Email can't be empty!")
			.isEmail().withMessage("Email format is invalid"),
		body("password")
			.not().isEmpty().withMessage("Password can't be empty!")
			.isLength({min: 6}).withMessage("Password must equal or greater than 6 character"),
		body("passwordConfirmation")
			.custom((value, {req}) => {
				if (value !== req.body.password) {
					throw new Error('Password confirmation does not match password');
				}
				return true;
			})
		],
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
