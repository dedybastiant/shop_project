const Sequelize = require('sequelize').Sequelize;

const sequelize = require('../utils/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  product_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  product_brand: {
    type: Sequelize.STRING,
    allowNull: false
  },
  product_description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  product_price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  product_category: {
    type: Sequelize.STRING,
    allowNull: false
  },
  product_subcategory: {
    type: Sequelize.STRING,
    allowNull: false
  },
  product_sku: {
    type: Sequelize.STRING,
    allowNull: false
  },
  new_product_flag: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  recommend_product_flag: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  product_rating: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  is_active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  updatedBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

module.exports = Product;