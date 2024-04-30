const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/yearSales", dashboardController.getYearlySales);

router.post("/productSales", dashboardController.getProductSales);
module.exports = router;
