const Sale = require("../models/sales");

exports.addRecord = async (record) => {
  const sale = new Sale(record);
  return await sale.save();
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
