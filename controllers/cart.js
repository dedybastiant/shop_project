const Cart = require("../models/cart");
const CartDetail = require("../models/cart_detail");
const Product = require("../models/product");
const Sequelize = require("sequelize").Sequelize;
const Op = Sequelize.Op;

exports.addToCart = async (req, res, next) => {
  const userId = req.userId;
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).json({ message: "Product Not Found!" });
  }

  let cart;
  const activeCart = await Cart.findAll({
    where: {
      user_id: userId,
      is_active: true,
    },
  });
  if (activeCart.length > 0) {
    if (activeCart.length > 1) {
      return res
        .status(400)
        .json({ status: "error", message: "Multiple Cart Active Found!" });
    }
    cart = await Cart.findByPk(activeCart[0].id);
    const oldQuantity = cart.total_item;
    const oldPrice = cart.total_price;
    await cart.update({
      total_item: oldQuantity + quantity,
      total_price: oldPrice + product.product_price * quantity,
      updatedBy: userId,
    });
  } else {
    cart = await Cart.create({
      user_id: userId,
      total_item: quantity,
      total_price: product.product_price * quantity,
      is_active: true,
      createdBy: userId,
    });
  }
  await cart.save();

  let cartDetail;
  const activeCartDetail = await CartDetail.findAll({
    where: {
      cart_id: cart.id,
      product_id: productId,
    },
  });

  if (activeCartDetail.length > 0) {
    cartDetail = await CartDetail.findByPk(activeCartDetail[0].id);
    const oldQuantity = cartDetail.quantity;
    const oldPrice = cartDetail.price;
    cartDetail.update({
      quantity: oldQuantity + quantity,
      price: oldPrice + product.product_price * quantity,
      updatedBy: userId,
    });
  } else {
    cartDetail = await CartDetail.create({
      cart_id: cart.id,
      product_id: productId,
      quantity: quantity,
      price: product.product_price * quantity,
      createdBy: userId,
    });
  }
  await cartDetail.save();
  res
    .status(200)
    .json({ status: "success", message: "Item Successfully Added To Cart" });
};

exports.updateCart = async (req, res, next) => {
  const userId = req.userId;
  const cartId = req.query.cartId;
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).json({ message: "Product Not Found!" });
  }

  const cartDetail = await CartDetail.findOne({
    where: {
      cart_id: cartId,
      product_id: productId,
    },
  });

  if (quantity < 1) {
    await cartDetail.destroy();
  } else {
    await cartDetail.update({
      quantity: quantity,
      price: product.product_price * quantity,
      updatedBy: userId,
    });
  }

  const newCartDetail = await CartDetail.findAll({
    where: {
      cart_id: cartId,
    },
  });

  let newTotalQuantity = 0;
  let newTotalPrice = 0;
  newCartDetail.map((cart) => {
    newTotalQuantity += cart.quantity;
    newTotalPrice += cart.price;
  });

  const cart = await Cart.findByPk(cartId);
  cart.update({
    total_item: newTotalQuantity,
    total_price: newTotalPrice,
  });

  res
    .status(200)
    .json({ status: "success", message: "Cart Successfully Updated" });
};

exports.deleteCartItem = async (req, res, next) => {
  const userId = req.userId;
  const cartId = req.params.cartId;
  const productIds = req.query.productId.split(",");

  const cartDetail = await CartDetail.destroy({
    where: {
      cart_id: cartId,
      product_id: {
        [Op.in]: productIds,
      },
    },
  });

  const newCartDetail = await CartDetail.findAll({
    where: {
      cart_id: cartId,
    },
  });

  let newTotalQuantity = 0;
  let newTotalPrice = 0;
  newCartDetail.map((cart) => {
    newTotalQuantity += cart.quantity;
    newTotalPrice += cart.price;
  });

  const cart = await Cart.findByPk(cartId);
  if (newTotalQuantity === 0) {
    cart.destroy();
  } else {
    cart.update({
      total_item: newTotalQuantity,
      total_price: newTotalPrice,
    });
  }

  res
    .status(200)
    .json({ status: "success", message: "CartItem Successfully Deleted!" });
};

exports.getCartById = async (req, res, next) => {
  const userId = req.userId;
  const cartId = req.params.cartId;

  const cart = await Cart.findByPk(cartId);
  if (!cart) {
    return res.status(404).json({ status: "error", message: "No Cart Found!" });
  }
  if (!cart.is_active) {
    return res
      .status(400)
      .json({ status: "error", message: "Cart Already Deleted!" });
  }
  if (cart.user_id != userId) {
    return res.status(401).json({ status: "error", message: "Unautorized" });
  }
  const cartDetail = await CartDetail.findAll({
    where: {
      cart_id: cartId,
    },
  });

  const cartDetailData = [];
  cartDetail.map((cart) => {
    const data = {
      id: cart.id,
      productId: cart.product_id,
      quantity: cart.quantity,
      price: cart.price,
      createdBy: cart.createdBy,
      createdAt: cart.createdAt,
      updatedBy: cart.updatedBy,
      updatedAt: cart.updatedAt,
    };
    cartDetailData.push(data);
  });

  const cartData = {
    id: cart.id,
    userId: cart.user_id,
    totalQuantity: cart.total_item,
    totalPrice: cart.total_price,
    cartItem: cartDetailData,
    createdBy: cart.createdBy,
    createdAt: cart.createdAt,
    updatedBy: cart.updatedBy,
    updatedAt: cart.updatedAt,
  };

  res.status(200).json({ status: "success", data: cartData });
};

exports.getCartByQuery = async (req, res, next) => {
  const userId = req.userId;

  const queryUserId = req.query.userId;
  const queryIsActive = req.query.is_active;
  const query = {};
  if (queryUserId) {
    query.user_id = queryUserId;
  }
  if (queryIsActive) {
    if (queryIsActive === "true") {
      query.is_active = true;
    } else if (queryIsActive === "false") {
      query.is_active = false;
    }
  }
  const carts = await Cart.findAll({ where: query });
  if (carts.length < 1) {
    return res.status(404).json({ status: "error", message: "No Cart Found!" });
  }

  const cartData = [];
  carts.map((cart) => {
    const data = {
      id: cart.id,
      userId: cart.user_id,
      totalQuantity: cart.total_item,
      totalPrice: cart.total_price,
      is_active: cart.is_active,
      createdBy: cart.createdBy,
      createdAt: cart.createdAt,
      updatedBy: cart.updatedBy,
      updatedAt: cart.updatedAt,
    };
    cartData.push(data);
  });

  res.status(200).json({ status: "success", data: cartData });
};
