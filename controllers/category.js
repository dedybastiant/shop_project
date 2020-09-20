const Category = require("../models/category");

exports.AddNewCategory = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const category = await Category.create({
    category_name: req.body.category,
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
  res.status(201).json({ status: "success", data: categoryData });
};
