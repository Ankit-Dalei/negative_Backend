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
const app = express();
dotenv.config();
const port =process.env.PORT||4000;


// const url = 'mongodb://localhost:27017/negative';
const url = process.env.MONGO_URL||'mongodb://localhost:27017/negative';
// chn
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

// SignUp System
app.get('/', (req,res)=>{
  res.send('connected')
});
app.post('/Signdata', CheckUserCredential,userStroe,userEmailVerify);
app.get('/Verify_email_Page/:id',userIsVerifyPage);
app.get('/Verify_email/:id',userIsVerify,sendVerificationSuccessEmail);

//Login System
app.post('/Logindata',userFind);

app.listen(port, () => {
  const url = `http://localhost:${port}/`;
  console.log(`\x1b[34mServer running at: ${url}\x1b[0m`);
});