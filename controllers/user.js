const User = require("../models/user");

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
