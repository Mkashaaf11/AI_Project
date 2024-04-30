const Product = require("../models/product");

exports.getProducts = async () => {
  return await Product.find({});
};

exports.getProduct = async (productID) => {
  return await Product.findById(productID);
};

exports.createProduct = async (newProduct) => {
  const product = new Product(newProduct);
  console.log("hello");
  return await product.save();
};

exports.updateProduct = async (productId, product) => {
  return await Product.findByIdAndUpdate(productId, product, { new: true });
};

exports.deleteProduct = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};
