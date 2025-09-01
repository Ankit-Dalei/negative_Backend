import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../Verify/createSSSConfig.js";
import archiver from "archiver";
import { randomBytes } from "crypto";
import { PassThrough } from "stream";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

// Use your actual secret from .env or config
const JWT_SECRET = process.env.JWT_SECRET;

export const ShareFiles = async (req, res) => {
  try {
    const bucketName = req.user.toString();
    const fileKeys = req.body;

    if (!Array.isArray(fileKeys) || fileKeys.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No file keys provided",
      });
    }

    // Generate random zip file name inside "shared" folder
    const fileKey = `shared_${randomBytes(4).toString("hex")}_${Date.now()}/download.zip`;

    // Collect archive into buffer
    const zipBuffer = await new Promise((resolve, reject) => {
      const archive = archiver("zip", { zlib: { level: 9 } });
      const chunks = [];
      const passthrough = new PassThrough();

      passthrough.on("data", (chunk) => chunks.push(chunk));
      passthrough.on("end", () => resolve(Buffer.concat(chunks)));
      passthrough.on("error", (err) => reject(err));

      archive.pipe(passthrough);

      // Stream each file from S3 into the archive
      (async () => {
        for (const key of fileKeys) {
          const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
          const s3Response = await s3.send(command);
          archive.append(s3Response.Body, { name: key.split("/").pop() });
        }
        archive.finalize();
      })();
    });

    // Upload the zip file to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: zipBuffer,
      ContentType: "application/zip",
    });

    await s3.send(uploadCommand);
    const token = jwt.sign({ bucketName }, JWT_SECRET);
    
    // Generate a presigned URL for download
    const obj = { fileKey, token };

    const params = new URLSearchParams(obj).toString();
    const downloadUrl = `${process.env.DownloadPage}?${params}`;
    return res.status(200).json({
      success: true,
      message: "Zip file created and uploaded to S3",
      url: downloadUrl,
    });
  } catch (error) {
    console.error("❌ Error creating share zip:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create share zip",
      error: error.message,
    });
  }
};
