const bycrypt = require("bcryptjs");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirmation = req.body.password_confirmation;
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const role = req.body.role;

  if (password !== passwordConfirmation) {
    return res
      .status(400)
      .json({ status: "error", message: "Password Confirmation Not Match" });
  }

  if (role !== "admin" && role !== "buyer") {
    return res
      .status(400)
      .json({ status: "error", message: "Role is invalid" });
  }

  const existingEmail = await User.findOne({
    where: { email: email },
  });
  if (existingEmail) {
    return res
      .status(400)
      .json({ status: "error", message: "Email Already Registered!" });
  }

  const existingPhoneNumber = await User.findOne({
    where: { phone_number: phoneNumber },
  });
  if (existingPhoneNumber) {
    return res
      .status(400)
      .json({ status: "error", message: "Phone Number Already Used!" });
  }

  const hashedPw = await bycrypt.hash(password, 12);
  const user = await User.create({
    email: email,
    password: hashedPw,
    name: name,
    phone_number: phoneNumber,
    role: role,
  });
  await user.save();

  const userData = {
    id: user.id,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.status(201).json({ status: "success", data: userData });
};
