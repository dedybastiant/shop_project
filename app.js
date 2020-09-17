const express = require("express");

const sequelize = require("./utils/database");

const app = express();

sequelize
  .sync({ force: true })
  // .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
