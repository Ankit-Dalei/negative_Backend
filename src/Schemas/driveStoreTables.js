import mongoose from "mongoose";

export const driveStoreTables = new mongoose.Schema({
  storeType: { type: String, required: true },  // e.g., "Electronics", "Clothing"
  storeName: { type: String, required: true },  // e.g., "ABC Store"
  id: { type: String, required: true },         // custom store id
  createdAt: { type: Date, default: Date.now }  // auto timestamp
});
