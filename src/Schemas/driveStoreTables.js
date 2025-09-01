import mongoose from "mongoose";

export const driveStoreTables = new mongoose.Schema({
  storeType: { type: String, required: true },  // e.g., "Folder", "File"
  storeName: { type: String, required: true },  // e.g., "File or Folder Name"
  id: { type: String, required: true },         // custom store id
  createdAt: { type: Date, default: Date.now }  // auto timestamp
});
