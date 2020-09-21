const Subcategory = require("../models/subcategory");
const Category = require("../models/category");

exports.AddNewSubcategory = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const categoryId = req.body.categoryId;
  const subcategoryName = req.body.subcategory;
  const category = await Category.findByPk(categoryId);
  if (!category) {
    return res
      .status(404)
      .json({ status: "error", message: "Category Not Found!" });
  }
  const subcategory = await Subcategory.create({
    category_id: categoryId,
    subcategory_name: subcategoryName,
    createdBy: userId,
    updatedBy: null,
  });
  await subcategory.save();
  const subcategoryData = {
    id: subcategory.id,
    category_id: subcategory.category_id,
    subcategory: subcategory.subcategory_name,
    createdBy: subcategory.createdBy,
    createdAt: subcategory.createdAt,
    updatedBy: subcategory.updatedBy,
    updatedAt: subcategory.updatedAt,
  };
  res.status(201).json({ status: "success", data: subcategoryData });
};

exports.updateCategory = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const subcategoryId = req.params.subcategoryId;
  const categoryId = req.body.categoryId;
  const subcategoryName = req.body.subcategory;
  const category = await Category.findByPk(categoryId);
  if (!category) {
    return res
      .status(404)
      .json({ status: "error", message: "Category Not Found!" });
  }
  const subcategory = await Subcategory.findByPk(subcategoryId);
  await subcategory.update({
    category_id: categoryId,
    subcategory_name: subcategoryName,
    updatedBy: userId,
  });
  await subcategory.save();
  const subcategoryData = {
    id: subcategory.id,
    categoryId: subcategory.category_id,
    subcategory: subcategory.subcategory_name,
    createdBy: subcategory.createdBy,
    createdAt: subcategory.createdAt,
    updatedBy: subcategory.updatedBy,
    updatedAt: subcategory.updatedAt,
  };
  res.status(201).json({ status: "success", data: subcategoryData });
};
