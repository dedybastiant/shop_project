const Address = require("../models/address");
const User = require("../models/user");

exports.addNewAddress = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const user = await User.findByPk(req.userId);
  if (!user) {
    return res
      .status(400)
      .json({ status: "error", message: "User Not Found!" });
  }

  const userId = req.userId;
  const addressDescription = req.body.address;
  const postalCode = req.body.postalCode;
  const district = req.body.district;
  const city = req.body.city;
  const province = req.body.province;
  const address = await Address.create({
    address: addressDescription,
    postal_code: postalCode,
    district: district,
    city: city,
    province: province,
    user_id: userId,
    is_active: true,
    createdBy: userId,
    updatedBy: null,
  });
  await address.save();

  const addressData = {
    id: address.id,
    address: address.address,
    postalCode: address.postal_code,
    disctrict: address.district,
    city: address.city,
    province: address.province,
    createdBy: address.createdBy,
    createdAt: address.createdAt,
    updatedBy: address.updatedBy,
    updatedAt: address.updatedAt,
  };
  res.status(201).json({ status: "success", data: addressData });
};

exports.updateAddress = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const user = await User.findByPk(userId);
  if (!user) {
    return res
      .status(400)
      .json({ status: "error", message: "User Not Found!" });
  }

  const addressId = req.params.addressId;
  const addressDescription = req.body.address;
  const postalCode = req.body.postalCode;
  const district = req.body.district;
  const city = req.body.city;
  const province = req.body.province;
  const address = await Address.findByPk(addressId);
  if (address.dataValues.is_active === false) {
    return res
      .status(400)
      .json({ status: "error", message: "Address Already Deleted." });
  }

  if (address.dataValues.user_id.toString() !== userId) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  await address.update({
    address: addressDescription,
    postal_code: postalCode,
    district: district,
    city: city,
    province: province,
    updatedBy: userId,
  });
  await address.save();

  const addressData = {
    id: address.id,
    address: address.address,
    postalCode: address.postal_code,
    disctrict: address.district,
    city: address.city,
    province: address.province,
    createdBy: address.createdBy,
    createdAt: address.createdAt,
    updatedBy: address.updatedBy,
    updatedAt: address.updatedAt,
  };
  res.status(200).json({ status: "success", data: addressData });
};

exports.deleteAddress = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const user = await User.findByPk(userId);
  if (!user) {
    return res
      .status(400)
      .json({ status: "error", message: "User Not Found!" });
  }

  const addressId = req.params.addressId;
  const address = await Address.findByPk(addressId);
  if (address.dataValues.is_active === false) {
    return res
      .status(400)
      .json({ status: "error", message: "Address Already Deleted." });
  }

  if (address.dataValues.user_id.toString() !== userId) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  await address.update({
    is_active: false,
  });
  await address.save();
  res.status(200).json({ status: "success", message: "Address Deleted!" });
};

exports.getAddressList = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const user = await User.findByPk(req.userId);
  if (!user) {
    return res
      .status(400)
      .json({ status: "error", message: "User Not Found!" });
  }

  const addresses = await Address.findAll({
    where: {
      user_id: userId,
    },
  });

  const addressData = [];
  addresses.map(address => {
    if (address.is_active === true) {
      const data = {
        id: address.id,
        userId: address.user_id,
        address: address.address,
      };
      addressData.push(data);
    }
  });
  res.status(200).json({ status: "success", data: addressData });
};

exports.getAddressById = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const user = await User.findByPk(req.userId);
  if (!user) {
    return res
      .status(400)
      .json({ status: "error", message: "User Not Found!" });
  }

  const addressId = req.params.addressId;
  const address = await Address.findByPk(addressId);
  if (address.dataValues.is_active === false) {
    return res
      .status(400)
      .json({ status: "error", message: "Address Already Deleted." });
  }

  if (address.dataValues.user_id.toString() !== userId) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const addressData = {
    id: address.id,
    address: address.address,
    postalCode: address.postal_code,
    disctrict: address.district,
    city: address.city,
    province: address.province,
    createdBy: address.createdBy,
    createdAt: address.createdAt,
    updatedBy: address.updatedBy,
    updatedAt: address.updatedAt,
  };
  res.status(201).json({ status: "success", data: addressData });
};
