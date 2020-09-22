const Sequelize = require('sequelize').Sequelize;

const sequelize = require('../utils/database');

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  user_id: {
    type: Sequelize.STRING,
    allowNull: false
  },
  total_item: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  total_price: {
    type: Sequelize.DOUBLE,
    allowNull: false
	},
	is_active: {
		type: Sequelize.BOOLEAN,
    allowNull: false
	},
	createdBy: {
		type: Sequelize.INTEGER,
    allowNull: true
	},
	updatedBy: {
		type: Sequelize.INTEGER,
    allowNull: true
	}
});

module.exports = Cart;