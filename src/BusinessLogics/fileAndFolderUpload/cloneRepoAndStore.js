import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import { PutObjectCommand, PutBucketWebsiteCommand } from "@aws-sdk/client-s3";
import { s3 } from "../Verify/createSSSConfig.js";
import mongoose from "mongoose";
import { driveStoreTables } from "../../Schemas/driveStoreTables.js";

export const cloneRepoAndStore = async (req, res) => {
  try {
    const bucketName = req.user.toString(); // Each user has their own bucket
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ success: false, message: "repoUrl is required" });
    }

    // Extract repo name
    const folderName = repoUrl.split("/").pop().replace(".git", "");
    const localPath = path.join("public/tmp", folderName);
    const folderKey = `${folderName}/`; // S3 folder
    // Mongo dynamic model
    const FolderModel =
      mongoose.models[bucketName] || mongoose.model(bucketName, driveStoreTables);

    // Check if folder already exists
    const existingFolder = await FolderModel.findOne({ storeType: "Folder", id: folderKey });
    if (existingFolder) {
      return res.status(409).json({
        success: false,
        message: `Folder "${folderName}" already exists in this bucket.`,
      });
    }

    // // 1️⃣ Clone the repo locally
    const git = simpleGit();
    await git.clone(repoUrl, localPath);

    // // 2️⃣ Create S3 folder placeholder
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: folderKey,
      Body: "",
    }));

    // // 3️⃣ Save root folder in MongoDB
    // await new FolderModel({
    //   storeType: "Folder",
    //   storeName: folderName,
    //   id: folderKey,
    // }).save();

    // // 4️⃣ Recursive function to upload repo contents
    const uploadDirectoryToS3 = async (dirPath, baseKey = folderName) => {
      const entries = fs.readdirSync(dirPath);
    
      for (const entry of entries) {
        if (entry === ".git") continue; // skip git folder
        const fullPath = path.join(dirPath, entry);
        const s3Key = path.posix.join(baseKey, entry);
    
        if (fs.lstatSync(fullPath).isDirectory()) {
          // Create folder in S3 (optional, can be skipped)
          await s3.send(new PutObjectCommand({ Bucket: bucketName, Key: `${s3Key}/`, Body: "" }));
    
          // ⚠️ Do NOT save directory in MongoDB
          await uploadDirectoryToS3(fullPath, s3Key); // recurse into folder
        } else {
          // Upload file to S3
          const fileContent = fs.readFileSync(fullPath);
          await s3.send(new PutObjectCommand({ Bucket: bucketName, Key: s3Key, Body: fileContent }));
    
          // Save file reference in Mongo
          await new FolderModel({
            storeType: "Folder", // use "File" instead of "Folder"
            storeName: entry,
            id: s3Key,
          }).save();
        }
      }
    };


    await uploadDirectoryToS3(localPath);

    // 5️⃣ Optional: Enable static web hosting for the bucket
    await s3.send(new PutBucketWebsiteCommand({
      Bucket: bucketName,
      WebsiteConfiguration: {
        IndexDocument: { Suffix: "index.html" },
        ErrorDocument: { Key: "error.html" }
      }
    }));

    // 6️⃣ Clean up local folder
    fs.rmSync(localPath, { recursive: true, force: true });

    res.status(200).json({
      success: true,
      message: "Repository cloned and uploaded successfully.",
      folderKey,
      folderUrl: `http://${bucketName}.s3-website.${process.env.AWS_REGION}.amazonaws.com/${folderKey}index.html`,
    });

  } catch (err) {
    console.error("❌ Error cloning repo:", err);
    res.status(500).json({
      success: false,
      message: "Failed to clone and upload repository",
      error: err.message,
    });
  }
};
