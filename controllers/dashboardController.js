const axios = require("axios");
const salesService = require("../services/salesServices");
const productService = require("../services/productServices");

exports.mainPage = async (req, res) => {
  const todaySales = await salesService.getTodaySales();
  const monthlySales = await salesService.getMonthlySales();
  const recentSale = await salesService.getRecentSale();
  const productCount = await productService.getProductCount();
  const recentProduct = await productService.getRecentProduct();
  const products = await productService.getProducts();
  res.render("dashboard/index", {
    todaySales,
    monthlySales,
    recentSale,
    productCount,
    recentProduct,
    products,
  });
};

exports.getRecords = async (req, res) => {
  try {
    const records = await salesService.getRecords();
    const products = await productService.getProducts();

    res.render("sales/index", { records, products });
  } catch (error) {
    res.status(500).json({ message: "Error getting sales!" });
  }
};

exports.getRecord = async (req, res) => {
  const id = req.params.id;
  try {
    const record = await salesService.getRecord(id);
    const products = await productService.getProducts();

    if (!record) {
      res.status(404).json({ message: "Record not found" });
    }
    res.render("sales/show", { record, products });
  } catch (error) {
    res.status(500).json({ message: "Error getting record" });
  }
};

exports.getNewSale = async (req, res) => {
  const products = await productService.getProducts();

  res.render("sales/new", { title: "Insert sales", products: products });
};

exports.createSale = async (req, res) => {
  const newRecord = req.body;
  console.log(newRecord);
  try {
    const createdRecord = await salesService.addRecord(newRecord);
    console.log(createdRecord);
    res.redirect("/dashboard/Sales");
  } catch (error) {
    res.status(500).json({ message: "Error creating record" });
  }
};

exports.getEditRecord = async (req, res) => {
  const id = req.params.id;

  try {
    const record = await salesService.getRecord(id);
    const products = await productService.getProducts();

    res.render("sales/edit", { record, products, title: "Edit Record" });
  } catch (error) {
    res.status(500).json({ message: "Error getting Record" });
  }
};

exports.updateRecord = async (req, res) => {
  const id = req.params.id;
  const updatedRecord = req.body;

  try {
    const updated = await salesService.updateRecord(id, updatedRecord);
    if (!updated) {
      res.status(404).json({ message: "Record not found for updation" });
    }
    res.redirect("/dashboard/sales/" + id);
  } catch (error) {
    res.status(500).json({ message: "Error occured while updation" });
  }
};

exports.deleteRecord = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await salesService.deleteRecord(id);
    if (!deleted) {
      res.status(400).json({ message: "Record not found for deletion" });
    }

    res.redirect("/dashboard/sales");
  } catch (error) {
    res.status(500).json({ message: "Error deleting Record" });
  }
};

exports.getYearlySales = async (req, res) => {
  try {
    // Fetch predictions from Flask API
    const flaskResponse = await axios.post(
      "http://localhost:5000/predict_prophet",
      {}
    );
    const predictions = flaskResponse.data;

    // Render dashboard view with predictions data
    res.render("dashboard/prophet", { predictions });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching predictions.");
  }
};

exports.renderProductIdForm = async (req, res) => {
  res.render("dashboard/ProductIdInput", { title: "insert product Id" });
};
exports.getProductSales = async (req, res) => {
  try {
    const { productID } = req.body;

    // Create an object containing only the features
    const productIDNumber = parseInt(productID);
    const features = {
      ProductID: productIDNumber,
    };

    const flaskResponse = await axios.post(
      "http://localhost:5000/predict_xgboost",
      {
        features: features,
      }
    );

    const predictions = flaskResponse.data;
    console.log(predictions);
    res.render("dashboard/xgboost", { predictions, productId: productID });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching predictions.");
  }
};
