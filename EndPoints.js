import express from "express";
import mongose from "mongoose";
import { CheckUserCredential } from "./src/BusinessLogics/Verify/userVerify.js";
import { userStroe } from "./src/BusinessLogics/SendToDatabase/userStore.js";
import { userEmailVerify } from "./src/BusinessLogics/EmailSender/userEmailVerify.js";
import { userIsVerify } from "./src/BusinessLogics/Verify/userIsVerify.js";
import { userIsVerifyPage } from "./src/BusinessLogics/Verify/userIsVerifyPage.js";
import { sendVerificationSuccessEmail } from "./src/BusinessLogics/EmailSender/userCreateSuccess.js";
const app = express();
const port = 4000;

const url = 'mongodb://localhost:27017/negative';

mongose.connect(url)
.then(async (client) => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/Signdata', CheckUserCredential,userStroe,userEmailVerify);
app.get('/Verify_email_Page/:id',userIsVerifyPage);
app.get('/Verify_email/:id',userIsVerify,sendVerificationSuccessEmail);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});