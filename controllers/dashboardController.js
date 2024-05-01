const axios = require("axios");
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
