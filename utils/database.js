const Sequelize = require("sequelize").Sequelize;

const sequelize = new Sequelize("shop", "root", "12345678", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
