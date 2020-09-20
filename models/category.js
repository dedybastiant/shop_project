const Sequelize = require("sequelize").Sequelize;

const sequelize = require("../utils/database");

const Category = sequelize.define("category", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  category_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.INTEGER,
  },
  updatedBy: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Category;
