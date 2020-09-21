const Product = require('../models/product');
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
    updatedBy: null
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
  }
  res.status(201).json({ status: 'success', data: productData });
};
