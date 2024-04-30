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

exports.getProductSales = async (req, res) => {
  try {
    const { productId } = req.query;

    const flaskResponse = await axios.post(
      "http://localhost:5000/predict_xgboost",
      {
        productId: productId,
      }
    );

    const predictions = flaskResponse.data;
    res.render("dashboard/xgboost", { predictions });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching predictions.");
  }
};
