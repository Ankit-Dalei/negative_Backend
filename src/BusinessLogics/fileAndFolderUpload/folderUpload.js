async function uploadToFolder(bucketName, folderName, fileName, fileContent) {
  try {
    const objectKey = `${folderName}/${fileName}`; // folder + filename
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: fileContent,
      ContentType: "text/plain"
    });
    await s3.send(command);
    console.log(`Uploaded "${objectKey}" to "${bucketName}"`);
  } catch (err) {
    console.error("Error uploading file:", err);
  }
}