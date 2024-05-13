const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const mongoose = require("./config/db");
const User = require("./models/user");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user with provided username exists in the database
    const user = await User.findOne({ username });

    if (!user) {
      // If user doesn't exist, redirect back to login page with error message
      return res.render("login", { error: "User not found" });
    }

    // Compare the provided password with the password stored in the database
    if (password !== user.password) {
      // If password is incorrect, redirect back to login page with error message
      return res.render("login", { error: "Invalid password" });
    }

    // If username and password are correct, redirect to the dashboard
    res.redirect("/dashboard");
  } catch (error) {
    // Handle any errors
    console.error("Login error:", error);
    res.render("login", { error: "Something went wrong" });
  }
});

app.use("/dashboard", dashboardRoutes);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
