const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/yearSales", dashboardController.getYearlySales);
router.get("/productSales", dashboardController.renderProductIdForm);
router.post("/productSales", dashboardController.getProductSales);
module.exports = router;
