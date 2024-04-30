const productService = require("../services/productServices");

exports.getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.render("products/index", { products });
  } catch (error) {
    res.status(500).json({ message: "Error getting products!" });
  }
};

exports.getProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await productService.getProduct(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }
    res.render("products/show", { product });
  } catch (error) {
    res.status(500).json({ message: "Error getting product" });
  }
};

exports.getNewProduct = async (req, res) => {
  res.render("products/new", { title: "Insert Product" });
};

exports.createProduct = async (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  try {
    const createdProduct = await productService.createProduct(newProduct);
    console.log(createdProduct);
    res.redirect("/products");
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

exports.getEditProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await productService.getProduct(id);
    res.render("products/edit", { product, title: "Edit Product" });
  } catch (error) {
    res.status(500).json({ message: "Error getting product" });
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const updatedProduct = req.body;

  try {
    const updated = await productService.updateProduct(id, updatedProduct);
    if (!updated) {
      res.status(404).json({ message: "product not found for updation" });
    }
    res.redirect("/products/" + id);
  } catch (error) {
    res.status(500).json({ message: "Error occured while updation" });
  }
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      res.status(400).json({ message: "Prodcut not found for deletion" });
    }

    res.status(200).json({ message: " Product deleted sucessfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
