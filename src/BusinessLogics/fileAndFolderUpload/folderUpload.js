import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../Verify/createSSSConfig.js";
import mongoose from "mongoose";
import { driveStoreTables } from "../../Schemas/driveStoreTables.js";

export const uploadToFolder = async (req, res, next) => {

  try {
    const bucketName = req.user.toString();  // your bucket name
    const fileName = req.file.originalname;  // original filename
    const root=req.body.rootFolder
    const path=req.body.path
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    if (!fileName) {
      return res.status(400).json({ success: false, message: "Filename is required" });
    }

    if (!path) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    if (!root) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Create a unique key (avoid overwrite if same filename uploaded again)
    const fileKey = `${root}/${path}`;
    // const fileKey = `${root}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,              // 👈 this is the Key you’ll need later
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
    });

    let response = await s3.send(command);

    // Log the ETag (hash)
    // console.log("ETag:", response.ETag);
    // console.log(bucketName)

    // Create dynamic model per bucket
    const fileModel = mongoose.models[`${bucketName}`] || mongoose.model(`${bucketName}`, driveStoreTables);

    // Save file info in MongoDB
    const storeFile = new fileModel({
      storeType: "Folder",
      storeName: fileName,  // Human-readable name
      id: fileKey,          // 👈 store fileKey, not ETag
    });

    let responses=await storeFile.save();

    res.status(200).json({
      success: true,
      message: "Folder uploaded successfully",
      fileKey,   // return fileKey to client (so you can delete later)
      fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
    });

  } catch (err) {
    console.error("Error uploading folder:", err);
    res.status(500).json({
      success: false,
      message: "folder upload failed",
      error: err.message,
    });
  }
};
