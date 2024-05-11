const Sale = require("../models/sales");

exports.addRecord = async (record) => {
  const sales = new Sale(record);
  return await sales.save();
};

exports.getRecord = async (recordID) => {
  return await Sale.findById(recordID);
};

exports.getRecords = async () => {
  return await Sale.find({});
};

exports.updateRecord = async (recordId, record) => {
  return await Sale.findByIdAndUpdate(recordId, record, { new: true });
};

exports.deleteRecord = async (recordId) => {
  return await Sale.findByIdAndDelete(recordId);
};

exports.getTodaySales = async () => {
  const today = new Date();
  today.setHours(0);

  const totalSalesToday = await Sale.aggregate([
    { $match: { date: { $gte: today } } },
    {
      $group: {
        _id: null,
        SalesQuantity: { $sum: "$sales" },
        totalAmount: { $sum: { $multiply: ["$sales", "$price"] } },
      },
    },
  ]);

  return totalSalesToday;
};

exports.getMonthlySales = async () => {
  const currMonth = new Date();
  currMonth.setDate(1);
  currMonth.setHours(0);

  const totalSalesMonthly = await Sale.aggregate([
    { $match: { date: { $gte: currMonth } } },
    {
      $group: {
        _id: null,
        SalesQuantity: { $sum: "$sales" },
        totalAmount: { $sum: { $multiply: ["$sales", "$price"] } },
      },
    },
  ]);
  return totalSalesMonthly;
};

exports.getRecentSale = async () => {
  const recentSale = await Sale.findOne().sort({ _id: -1 });
  return recentSale;
};
