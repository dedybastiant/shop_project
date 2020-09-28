const bycrypt = require("bcryptjs");
const { Sequelize } = require("../utils/database");
const User = require("../models/user");

const Op = Sequelize.Op;

exports.updateUser = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const email = req.body.email;
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;

  const user = await User.findByPk(userId);
  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "User Data Not Found!" });
  }

  if (email !== user.email) {
    const existingEmail = await User.findOne({
      where: { email: email },
    });
    if (existingEmail) {
      return res
        .status(400)
        .json({ status: "error", message: "Email Already Used!" });
    }
  }

  if (phoneNumber !== user.phone_number) {
    const existingPhoneNumber = await User.findOne({
      where: { phone_number: phoneNumber },
    });
    if (existingPhoneNumber) {
      return res
        .status(400)
        .json({ status: "error", message: "Phone Number Already Used!" });
    }
  }

  user.update({
    email: email,
    name: name,
    phone_number: phoneNumber,
  });
  await user.save();
  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    phoneNumber: user.phone_number,
    createdAt: user.createdAt,
    updatedBy: req.userId,
    updatedAt: user.updatedAt,
  };
  res.status(200).json({ status: "success", data: userData });
};

exports.changePassword = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const newPasswordConfirmation = req.body.newPasswordConfirmation;

  const user = await User.findByPk(userId);
  console.log(user);
  const isEqual = await bycrypt.compare(oldPassword, user.password);
  if (!isEqual) {
    return res.status(401).json({
      status: "error",
      message: "Old Password Incorrect",
    });
  }

  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).json({
      status: "error",
      message: "New Password Confirmation Incorrect",
    });
  }

  if (
    newPassword === ("" || null) ||
    newPasswordConfirmation === ("" || null)
  ) {
    return res.status(400).json({
      status: "error",
      message: "Password Should Not Empty",
    });
  }

  const hashedPw = await bycrypt.hash(newPassword, 12);
  await user.update({
    password: hashedPw,
  });
  await user.save();

  res
    .status(200)
    .json({ status: "success", message: "Password successfully changed" });
};

exports.getUserByQuery = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const query = {};
  if (req.query.email) {
    query.email = { [Op.like]: `%${req.query.email}%` };
  }
  if (req.query.name) {
    query.name = { [Op.like]: `%${req.query.name}%` };
  }
  if (req.query.phoneNumber) {
    query.phone_number = { [Op.like]: `%${req.query.phoneNumber}%` };
  }

  const users = await User.findAll({ where: query });
  const userData = [];
  users.map((user) => {
    const data = {
      id: user.id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phone_number,
      createdAt: user.createdAt,
      updatedBy: user.updatedBy,
      updatedAt: user.updatedAt,
    };
    userData.push(data);
  });
  res.status(200).json({ status: "success", data: userData });
};

exports.getUserById = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const user = await User.findByPk(userId);
  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    phoneNumber: user.phone_number,
    createdAt: user.createdAt,
    updatedBy: user.updatedBy,
    updatedAt: user.updatedAt,
  };
  res.status(200).json({ status: "success", data: userData });
};
