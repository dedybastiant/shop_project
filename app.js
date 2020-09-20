const express = require("express");
const bodyParser = require ("body-parser");

const sequelize = require("./utils/database");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const addressRoutes = require("./routes/address");

const app = express();

app.use(bodyParser.json());

app.use(authRoutes);
app.use(userRoutes);
app.use(addressRoutes);

sequelize
  .sync({ force: true })
  // .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
