const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// specific routes before the catch-all route
router.get("/new", productController.getNewProduct);
router.get("/edit/:id", productController.getEditProduct);
router.get("/:id", productController.getProduct);

// catch-all routes
router.get("/", productController.getProducts);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
