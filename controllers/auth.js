const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    res.status(404).json({ status: "error", message: "User Not Found!" });
  }

  const isEqual = await bycrypt.compare(password, user.password);
  if (!isEqual) {
    return res
      .status(403)
      .json({ status: "error", message: "Password Incorrect" });
  }

  loadedUser = user;
  const token = jwt.sign(
    {
      email: loadedUser.email,
      userId: loadedUser.id.toString(),
      role: loadedUser.role
    },
    "somesupersecretsecret",
    { expiresIn: "1h" }
  );
  const loginData = {
    email: loadedUser.email,
    name: loadedUser.name,
    role: loadedUser.role,
    token: token,
  };
  res.status(200).json({ status: "success", data: loginData });
};
