const Product = require("../models/product");
// const ProductImage = require('../models/product_image');

exports.addNewProduct = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const name = req.body.name;
  const brand = req.body.brand;
  const description = req.body.description;
  const price = req.body.price;
  const category = req.body.category;
  const subcategory = req.body.subcategory;
  //   const productImage = req.body.image;
  const sku = req.body.sku;
  //   if (!productImage) {
  //     return res.status(400).json({status: 'Images Should Not Be Empty!'});
  //   }
  const product = await Product.create({
    product_name: name,
    product_brand: brand,
    product_description: description,
    product_price: price,
    product_category: category,
    product_subcategory: subcategory,
    product_sku: sku,
    new_product_flag: true,
    is_active: true,
    createdBy: userId,
    updatedBy: null,
  });
  await product.save();
  const productData = {
    id: product.id,
    name: product.product_name,
    brand: product.product_brand,
    description: product.product_description,
    price: product.product_price,
    category: product.product_category,
    subcategory: product.product_subcategory,
    sku: product.product_sku,
    newProductFlag: product.new_product_flag,
    recommendationFlag: product.recommend_product_flag,
    rating: product.product_rating,
    createdBy: product.createdBy,
    createdAt: product.createdAt,
    updatedBy: product.updatedBy,
    updatedAt: product.updatedAt,
  };
  res.status(201).json({ status: "success", data: productData });
};

exports.updateProduct = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const userId = req.userId;
  const productId = req.params.productId;
  const name = req.body.name;
  const brand = req.body.brand;
  const description = req.body.description;
  const price = req.body.price;
  const category = req.body.category;
  const subcategory = req.body.subcategory;
  const sku = req.body.sku;
  const newProduct = req.body.newProduct;
  const recommendProduct = req.body.recommendProduct;
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).json({ message: "Product Not Found!" });
  }
  product.update({
    product_name: name,
    product_brand: brand,
    product_description: description,
    product_price: price,
    product_category: category,
    product_subcategory: subcategory,
    product_sku: sku,
    new_product_flag: newProduct,
    recommend_product_flag: recommendProduct,
    updatedBy: userId,
  });
  await product.save();
  const productData = {
    id: product.id,
    name: product.product_name,
    brand: product.product_brand,
    description: product.product_description,
    price: product.product_price,
    category: product.product_category,
    subcategory: product.product_subcategory,
    sku: product.product_sku,
    newProductFlag: product.new_product_flag,
    recommendationFlag: product.recommend_product_flag,
    rating: product.product_rating,
    createdBy: product.createdBy,
    createdAt: product.createdAt,
    updatedBy: product.updatedBy,
    updatedAt: product.updatedAt,
  };
  res.status(200).json({ status: "success", data: productData });
};

exports.getProductById = async (req, res, next) => {
  if (!req.isAuth || req.userRole !== "admin") {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const productId = req.params.productId;
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).json({ message: "Product Not Found!" });
  }
  const productData = {
    id: product.id,
    name: product.product_name,
    brand: product.product_brand,
    description: product.product_description,
    price: product.product_price,
    category: product.product_category,
    subcategory: product.product_subcategory,
    sku: product.product_sku,
    newProductFlag: product.new_product_flag,
    recommendationFlag: product.recommend_product_flag,
    rating: product.product_rating,
    createdBy: product.createdBy,
    createdAt: product.createdAt,
    updatedBy: product.updatedBy,
    updatedAt: product.updatedAt,
  };
  res.status(200).json({ status: "success", data: productData });
};
