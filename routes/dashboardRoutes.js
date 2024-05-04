const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/", dashboardController.mainPage);
router.get("/sales", dashboardController.getRecords);
router.get("/sales/new", dashboardController.getNewSale);
router.get("/sales/:id", dashboardController.getRecord);

router.post("/sales/new", dashboardController.createSale);
router.get("/sales/edit/:id", dashboardController.getEditRecord);
router.put("/sales/edit/:id", dashboardController.updateRecord);
router.delete("/sales/delete/:id", dashboardController.deleteRecord);
router.get("/yearSales", dashboardController.getYearlySales);
router.get("/productSales", dashboardController.renderProductIdForm);
router.post("/productSales", dashboardController.getProductSales);
module.exports = router;
