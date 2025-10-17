import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../Verify/createSSSConfig.js";
import mongoose from "mongoose";
import { driveStoreTables } from "../../Schemas/driveStoreTables.js";

export const createFolder = async (req, res, next) => {
  try {
    const bucketName = req.user.toString(); // Each user has their own bucket
    const { folderName, rootFolder = "", path = "" } = req.body;

    if (!folderName) {
      return res.status(400).json({ success: false, message: "Folder name is required" });
    }

    // Construct full folder path
    const folderKeyParts = [rootFolder, path, folderName].filter(Boolean);
    const folderKey = folderKeyParts.join("/") + "/";

    // Use dynamic collection for each bucket (user)
    const FolderModel =
      mongoose.models[bucketName] || mongoose.model(bucketName, driveStoreTables);

    // 🔍 Check if folder already exists
    const existingFolder = await FolderModel.findOne({
      storeType: "Folder",
      id: folderKey, // check exact path match
    });

    if (existingFolder) {
      return res.status(409).json({
        success: false,
        message: `Folder "${folderName}" already exists in this location.`,
      });
    }

    // Create folder placeholder in S3
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: folderKey,
      Body: "", // empty body
    });

    await s3.send(command);

    // Save folder info in MongoDB
    const newFolder = new FolderModel({
      storeType: "Folder",
      storeName: folderName,
      id: folderKey,
    });

    await newFolder.save();

    res.status(200).json({
      success: true,
      message: "Folder created successfully",
      folderKey,
      folderUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${folderKey}`,
    });
  } catch (err) {
    console.error("Error creating folder:", err);
    res.status(500).json({
      success: false,
      message: "Folder creation failed",
      error: err.message,
    });
  }
};
