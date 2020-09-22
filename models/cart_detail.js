const Sequelize = require('sequelize').Sequelize;

const sequelize = require('../utils/database');

const CartDetail = sequelize.define('cart_detail', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  cart_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
});

module.exports = CartDetail;