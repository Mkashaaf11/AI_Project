const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const mongoose = require("./config/db");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.static(path.join(__dirname, "public")));

app.use("/products", productRoutes);
app.use("/dashboard", dashboardRoutes);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
