import express from "express";
// import { MongoClient } from 'mongodb';
import mongoose from "mongoose";
import cors from 'cors'
import dotenv from 'dotenv';
import { CheckUserCredential } from "./src/BusinessLogics/Verify/userVerify.js";
import { userStroe } from "./src/BusinessLogics/SendToDatabase/userStore.js";
import { userEmailVerify } from "./src/BusinessLogics/EmailSender/userEmailVerify.js";
import { userIsVerify } from "./src/BusinessLogics/Verify/userIsVerify.js";
import { userIsVerifyPage } from "./src/BusinessLogics/Verify/userIsVerifyPage.js";
import { sendVerificationSuccessEmail } from "./src/BusinessLogics/EmailSender/userCreateSuccess.js";
import { userFind } from "./src/BusinessLogics/FindFromDatabass/userFind.js";
import { verifyUser } from "./src/BusinessLogics/Verify/verifyUserForTab.js";
import { getMainCloudTable } from "./src/BusinessLogics/FindFromDatabass/getMainCloudTable.js";
import { uploadDataFile } from "./src/BusinessLogics/fileAndFolderUpload/fileUpload.js";
import multer from "multer";
import { deleteFiles } from "./src/BusinessLogics/fileAndFolderUpload/fileDelete.js";
import { downloadFiles } from "./src/BusinessLogics/fileAndFolderUpload/fileDownload.js";
import { ShareFiles } from "./src/BusinessLogics/fileAndFolderUpload/fileShare.js";
import { downloadPage } from "./src/BusinessLogics/fileAndFolderUpload/downloadPage.js";
import { downloadZipFiles } from "./src/BusinessLogics/fileAndFolderUpload/downloadZipFiles.js";
import { uploadToFolder } from "./src/BusinessLogics/fileAndFolderUpload/folderUpload.js";

const app = express();
dotenv.config();
const port =process.env.PORT||4000;


// const url = 'mongodb://localhost:27017/negative';
const url = process.env.MONGO_URL||'mongodb://localhost:27017/negative';

app.use(cors({
  origin: process.env.ORIGIN, // Allow only your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies (if needed)
}));

mongoose.connect(url)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// multer
// okay
// Configure multer middleware
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit
//   },
// });

const upload = multer({
  storage: multer.memoryStorage(), // or diskStorage if needed
});


// SignUp System
app.get('/', (req,res)=>{
  res.send('connected')
});
app.post('/Signdata', CheckUserCredential,userStroe,userEmailVerify);
app.get('/Verify_email_Page/:id',userIsVerifyPage);
// app.get('/Verify_email/:id',userIsVerify,sendVerificationSuccessEmail);
app.get('/Verify_email/:id',userIsVerify);

//Login System
app.post('/Logindata',userFind);

// Cloud System
app.get('/getMainCloudTable/:id',verifyUser,getMainCloudTable);
// app.post('/createFolder',verifyUser);
app.post('/uploadFiles/:id',verifyUser,upload.single('file'),uploadDataFile);
app.post('/uploadFolders/:id',verifyUser,upload.single('file'),uploadToFolder);
// ✅ Delete file by id
app.delete('/DeleteFile/:id', verifyUser, deleteFiles);
// ✅ Download files
app.post('/DownloadFile/:id', verifyUser, downloadFiles);
// ✅ Share files
app.post('/ShareFile/:id', verifyUser, ShareFiles);
app.get('/ShareZipFile', downloadPage);
app.get('/DownloadZipFile', downloadZipFiles);


app.post('/gitCofig',verifyUser);

app.listen(port, () => {
  const url = `http://localhost:${port}/`;
  console.log(`\x1b[34mServer running at: ${url}\x1b[0m`);
});