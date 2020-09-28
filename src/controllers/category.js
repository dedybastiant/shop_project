const Category = require("../models/category");
const { Sequelize } = require("../utils/database");
const Op = Sequelize.Op;

exports.AddNewCategory = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const category = await Category.create({
    category_name: req.body.category,
    is_active: true,
    createdBy: userId,
    updateBy: null,
  });
  await category.save();
  const categoryData = {
    id: category.id,
    category: category.category_name,
    createdBy: category.createdBy,
    createdAt: category.createdAt,
    updatedBy: category.updatedBy,
    updatedAt: category.updatedAt,
  };
  res.status(201).json({ status: "success", data: categoryData });
};

exports.updateCategory = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const categoryId = req.params.categoryId;
  const category = await Category.findByPk(categoryId);
  await category.update({
    category_name: req.body.category,
    updatedBy: userId,
  });
  await category.save();
  const categoryData = {
    id: category.id,
    category: category.category_name,
    createdBy: category.createdBy,
    createdAt: category.createdAt,
    updatedBy: category.updatedBy,
    updatedAt: category.updatedAt,
  };
  res.status(200).json({ status: "success", data: categoryData });
};

exports.deleteCategory = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const categoryId = req.params.categoryId;
  const category = await Category.findByPk(categoryId);
  await category.update({
    category_name: req.body.category,
    is_active: false,
    updatedBy: userId,
  });
  await category.save();
  res
    .status(200)
    .json({ status: "success", message: "Category Successfully Deleted!" });
};

exports.getCategoryById = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const categoryId = req.params.categoryId;
  const category = await Category.findByPk(categoryId);
  const categoryData = {
    id: category.id,
    category: category.category_name,
    createdBy: category.createdBy,
    createdAt: category.createdAt,
    updatedBy: category.updatedBy,
    updatedAt: category.updatedAt,
  };
  await category.save();
  res.status(200).json({ status: "success", data: categoryData });
};

exports.getCategoryByQuery = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const categoryName = req.query.category;
  const is_active = req.query.is_active;
  const query = {};
  if (categoryName) {
    query.category_name = { [Op.like]: `%${categoryName}%` };
  }
  if (is_active) {
    query.is_active = { [Op.like]: `%${is_active}%` };
  }
  const categories = await Category.findAll({ where: query });
  const categoryData = [];
  categories.map(category => {
    const data = {
      id: category.id,
      category: category.category_name,
      createdBy: category.createdBy,
      createdAt: category.createdAt,
      updatedBy: category.updatedBy,
      updatedAt: category.updatedAt,
    };
    categoryData.push(data);
  });
  res.status(200).json({ status: "success", data: categoryData });
};
