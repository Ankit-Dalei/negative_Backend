import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { s3 } from "../Verify/createSSSConfig.js";
import mongoose from "mongoose";
import { driveStoreTables } from "../../Schemas/driveStoreTables.js";

export const deleteFiles = async (req, res, next) => {
  try {
    const bucketName = req.user.toString();
    const fileKeys = req.body;

    if (!Array.isArray(fileKeys) || fileKeys.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No file keys provided",
      });
    }

    // Step 1: Delete from S3
    const command = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: fileKeys.map((key) => ({ Key: key })),
      },
    });

    const result = await s3.send(command);

    if (result.Deleted && result.Deleted.length > 0) {
      // Step 2: Delete matching docs in Mongo (where "key" field matches fileKeys)
      const fileModel = mongoose.model(bucketName, driveStoreTables);
      const mongoResult = await fileModel.deleteMany({ id: { $in: fileKeys } });
      return res.status(200).json({
        success: true,
        message: "Files deleted successfully from S3 and Mongo",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "S3 deletion failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "File delete failed",
      error: error.message,
    });
  }
};
