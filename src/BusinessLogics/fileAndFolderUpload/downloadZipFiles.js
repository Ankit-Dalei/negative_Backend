import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../Verify/createSSSConfig.js";
import archiver from "archiver";

export const downloadZipFiles = async (req, res) => {
  try {
    const bucketName = req.query.userId?.toString();
    const fileKeys = JSON.parse(req.query.str);

    if (!Array.isArray(fileKeys) || fileKeys.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No file keys provided",
      });
    }

    // ✅ Step 1: Check if all files exist first
    for (const key of fileKeys) {
      try {
        await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
      } catch (err) {
        if (err.name === "NoSuchKey" || err.Code === "NoSuchKey") {
          return res.status(404).send(`
            <html>
              <head><title>Invalid Link</title></head>
              <body style="font-family: Arial; text-align: center; margin-top: 50px;">
                <h2>❌ Link Invalid</h2>
                <p>The file you are trying to download does not exist.</p>
              </body>
            </html>
          `);
        }
        throw err; // other errors bubble up
      }
    }

    // ✅ Step 2: If all files exist, then start streaming ZIP
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=files.zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    for (const key of fileKeys) {
      const s3Response = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
      archive.append(s3Response.Body, { name: key.split("/").pop() });
    }

    await archive.finalize();
  } catch (error) {
    console.error("❌ Error downloading files:", error);

    res.setHeader("Content-Type", "text/html");
    return res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial; text-align: center; margin-top: 50px;">
          <h2>⚠️ File download failed</h2>
          <p>${error.message}</p>
        </body>
      </html>
    `);
  }
};
