const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MDB;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to Mongo Successfully");
  } catch (error) {
    console.log("error" + error);
  }
};
module.exports = connectToMongo;
