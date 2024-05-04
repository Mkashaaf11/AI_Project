const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  customID: { type: Number, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  competitorPrice: { type: Number, required: true },
});

productSchema.pre("save", async function (next) {
  if (!this.customID) {
    try {
      const count = await mongoose.models.Product.countDocuments();
      this.customID = count + 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
