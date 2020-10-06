const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./utils/database");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const addressRoutes = require("./routes/address");
const categoryRoutes = require("./routes/category");
const subcategoryRoutes = require("./routes/subcategory");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");

const app = express();

app.use(bodyParser.json());

app.use(authRoutes);
app.use(userRoutes);
app.use(addressRoutes);
app.use(categoryRoutes);
app.use(subcategoryRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ status: "error", message: message, description: data[0].msg});
});

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
