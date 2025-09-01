import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../Verify/createSSSConfig.js";
import archiver from "archiver";

export const downloadFiles = async (req, res) => {
  try {
    const bucketName = req.user.toString();
    const fileKeys = req.body;
    if (!Array.isArray(fileKeys) || fileKeys.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No file keys provided",
      });
    }

    // Prepare zip response
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=files.zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    // Stream each file into the zip
    for (const key of fileKeys) {
      const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
      const s3Response = await s3.send(command);

      // Body is a stream → append it to archive
      archive.append(s3Response.Body, { name: key.split("/").pop() });
    }

    await archive.finalize();
  } catch (error) {
    console.error("❌ Error downloading files:", error);
    res.status(500).json({
      success: false,
      message: "File download failed",
      error: error.message,
    });
  }
};
