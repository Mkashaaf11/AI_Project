const mongoose = require("mongoose");

const dbURI = "mongodb://localhost:27017/shopAI";

const dbConnection = mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the database"))
  .catch((error) => console.error("Error connecting to the database:", error));

module.exports = dbConnection;
