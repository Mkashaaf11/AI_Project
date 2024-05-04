const mongoose = require("mongoose");
const salesSchema = mongoose.Schema({
  date: { type: Date, required: true },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  sales: { type: Number, required: true },
  price: { type: Number, required: true },
  competitorPrice: { type: Number, required: true },
  customID: { type: Number, required: true },
});

module.exports = mongoose.model("sales", salesSchema);
