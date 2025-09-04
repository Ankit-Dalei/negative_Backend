import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../Verify/createSSSConfig.js";
import mongoose from "mongoose";
import { driveStoreTables } from "../../Schemas/driveStoreTables.js";

export const uploadDataFile = async (req, res, next) => {
  try {
    const bucketName = req.user.toString();  // your bucket name
    const fileName = req.file.originalname;  // original filename
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    if (!fileName) {
      return res.status(400).json({ success: false, message: "Filename is required" });
    }

    // Create a unique key (avoid overwrite if same filename uploaded again)
    const fileKey = `uploads/${Date.now()}_${fileName}`;

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
      storeType: "File",
      storeName: fileName,  // Human-readable name
      id: fileKey,          // 👈 store fileKey, not ETag
    });

    let responses=await storeFile.save();
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileKey,   // return fileKey to client (so you can delete later)
      fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
    });

  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: err.message,
    });
  }
};
