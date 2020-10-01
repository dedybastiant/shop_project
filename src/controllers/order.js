const Cart = require("../models/cart");
const CartDetail = require("../models/cart_detail");
const Order = require("../models/order");
const OrderDetail = require("../models/order _detail");

exports.createOrder = async (req, res, next) => {
	const isAuth = req.isAuth;
	if (!isAuth) {
		return res
			.status(401)
			.json({ status: "error", message: "Unauthorized" });
	}
	const userId = req.userId;
	const cartId = req.body.cartId;
	const date = new Date();
	const cart = await Cart.findByPk(cartId);
	if (!cart) {
		return res.status(404).json({ message: "Cart Not Found!" });
	}
	const stringId = cart.id.toString();
	const invoiceNumber = `INV/${date.getUTCFullYear()}/${date.getUTCMonth()}/${stringId.padStart(
		10,
		"0"
	)}`;
	const cartDetail = await CartDetail.findAll({
		where: {
			cart_id: cart.id,
		},
	});
	const order = await Order.build({
		cart_id: cart.id,
		user_id: userId,
		invoice_number: invoiceNumber,
		total_item: cart.total_item,
		total_price: cart.total_price,
		is_active: true,
		createdBy: userId
	});
	await order.save();
	await cartDetail.map((cartItem) => {
		const orderDetail = OrderDetail.build({
			order_id: order.id,
			product_id: cartItem.product_id,
			total_item: cartItem.total_item,
			total_price: cartItem.total_price,
		});
		await orderDetail.save();
		await cartItem.destroy();
	});
	await cart.destroy();
	res.status(200).json({ status: "success" });
};

exports.getOrderByQuery = async (req, res, next) => {
	const isAuth = req.isAuth;
	if (!isAuth) {
		return res
			.status(401)
			.json({ status: "error", message: "Unauthorized" });
	}
	const orders = await Order.findAll();
	if (!order) {
		return res.status(404).json({ message: "Order Not Found!" });
	}
	const orderData = [];
	orders.map(order => {
		const data = {
			id: order.id,
			cartId: order.cart_id,
			userId: order.user_id,
			invoiceNumber: order.invoice_number,
			totalItem: order.total_item,
			totalPrice: order.total_price,
			createdBy: order.createdBy,
			createdAt: order.createdAt,
			updatedBy: order.updatedBy,
			updatedAt: order.updatedAt
		}
		orderData.push(data);
	});
	res.status(200).json({ status: "success", data: orderData });
};

exports.getOrderById = async (req, res, next) => {
	const isAuth = req.isAuth;
	if (!isAuth) {
		return res
			.status(401)
			.json({ status: "error", message: "Unauthorized" });
	}
	const orderId = req.params.orderId;
	const order = await Order.findByPk(orderId, { raw: true });
	if (!order) {
		return res.status(404).json({ message: "Order Not Found!" });
	}
	const orderDetails = await OrderDetail.findAll({
		where: { order_id: order.id },
	});
	if (!order) {
		return res.status(404).json({ message: "Order Detail Not Found!" });
	}
	const orderDetailData = [];
	orderDetails.map(orderDetail => {
		const data = {
			id: orderDetail.id,
			productId: orderDetail.product_id,
			totalQuantity: orderDetail.total_item,
			price: orderDetail.total_price,
		}
		orderDetailData.push(data);
	});
	const orderData = {
		id: order.id,
		cartId: order.cart_id,
		userId: order.user_id,
		invoiceNumber: order.invoice_number,
		orderDetail: {
			orderDetailData
		},
		totalItem: order.total_item,
		totalPrice: order.total_price,
		createdBy: order.createdBy,
		createdAt: order.createdAt,
		updatedBy: order.updatedBy,
		updatedAt: order.updatedAt
	}
	res.status(200).json({ status: "success", order: orderData });
};

exports.calcenOrder = async (req, res, next) => {
	const isAuth = req.isAuth;
	if (!isAuth) {
		return res
			.status(401)
			.json({ status: "error", message: "Unauthorized" });
	}
	const userId = req.userId;
	const orderId = req.params.orderId;
	const order = await Order.findByPk(orderId);
	await order.update({
		is_active: false
	});
	await order.save();
	res.status(200).json({status: 'success', message: 'Order Successfully Canceled!'});
}