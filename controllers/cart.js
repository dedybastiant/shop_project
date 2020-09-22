const Cart = require("../models/cart");
const CartDetail = require("../models/cart_detail");
const Product = require("../models/product");

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
