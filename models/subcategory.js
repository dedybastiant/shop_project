const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Subcategory = sequelize.define('subcategory', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  subcategory_name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Subcategory;