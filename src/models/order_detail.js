const Sequelize = require('sequelize').Sequelize;

const sequelize = require('../utils/database');

const OrderDetail = sequelize.define('order_detail', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  order_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  total_item: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  total_price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
});

module.exports = OrderDetail;