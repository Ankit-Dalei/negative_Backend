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
    const token = jwt.sign({ bucketName }, JWT_SECRET);
    // Generate a presigned URL for download
    let str=JSON.stringify(fileKeys)
    // console.log(str)
    const obj = { str, token };

    const params = new URLSearchParams(obj).toString();
    // console.log(params)
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
