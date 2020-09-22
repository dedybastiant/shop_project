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
    is_active: true,
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

exports.updateSubcategory = async (req, res, next) => {
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
  if (!subcategory) {
    return res
      .status(404)
      .json({ status: "error", message: "Subcategory Not Found!" });
  }
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

exports.deleteSubcategory = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const subcategoryId = req.params.subcategoryId;
  const subcategory = await Subcategory.findByPk(subcategoryId);
  if (!subcategory || subcategory.is_active === false) {
    return res
      .status(400)
      .json({ status: "error", message: "Subcategory Not Found!" });
  }
  await subcategory.update({
    is_active: false,
    updatedBy: userId,
  });
  await subcategory.save();
  res
    .status(201)
    .json({ status: "success", message: "Subcategory Successfully Deleted!" });
};

exports.getSubcategoryById = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const subcategoryId = req.params.subcategoryId;
  const subcategory = await Subcategory.findByPk(subcategoryId);
  if (!subcategory || subcategory.is_active === false) {
    return res
      .status(400)
      .json({ status: "error", message: "Subcategory Not Found!" });
  }
  const subdatgoryData = {
    id: subcategory.id,
    categoryId: subcategory.category_id,
    subcategory: subcategory.subcategory_name,
    createdBy: subcategory.createdBy,
    createdAt: subcategory.createdAt,
    updatedBy: subcategory.updatedBy,
    updatedAt: subcategory.updatedAt,
  };
  res.status(201).json({ status: "success", data: subdatgoryData });
};

exports.getSubcategoryByQuery = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const categoryId = req.query.categoryId;
  const subcategoryName = req.query.subcategoryName;
  const is_active = req.query.is_active;
  const query = {};
  if (categoryId) {
    query.categoryId = { [Op.like]: `%${categoryId}%` };
  }
  if (subcategoryName) {
    query.subcategoryName = { [Op.like]: `%${subcategoryName}%` };
  }
  if (is_active) {
    if (is_active === "true") {
      query.is_active = true;
    } else if (is_active === "false") {
      query.is_active = false;
    }
  }
  const subcategories = await Subcategory.findAll({ where: query });
  const subcategoryData = [];
  subcategories.map((subcategory) => {
    const data = {
      id: subcategory.id,
      categoryId: subcategory.category_id,
      subcategory: subcategory.subcategory_name,
      createdBy: subcategory.createdBy,
      createdAt: subcategory.createdAt,
      updatedBy: subcategory.updatedBy,
      updatedAt: subcategory.updatedAt,
    };
    subcategoryData.push(data);
  });
  res.status(200).json({ status: "success", data: subcategoryData });
};
