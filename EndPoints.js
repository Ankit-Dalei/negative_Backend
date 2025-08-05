import express from "express";
import { MongoClient } from 'mongodb';
import cors from 'cors'
import { CheckUserCredential } from "./src/BusinessLogics/Verify/userVerify.js";
import { userStroe } from "./src/BusinessLogics/SendToDatabase/userStore.js";
import { userEmailVerify } from "./src/BusinessLogics/EmailSender/userEmailVerify.js";
import { userIsVerify } from "./src/BusinessLogics/Verify/userIsVerify.js";
import { userIsVerifyPage } from "./src/BusinessLogics/Verify/userIsVerifyPage.js";
import { sendVerificationSuccessEmail } from "./src/BusinessLogics/EmailSender/userCreateSuccess.js";
import { userFind } from "./src/BusinessLogics/FindFromDatabass/userFind.js";
const app = express();
const port = 4000;

const url = 'mongodb+srv://ankitdalei123:G4gKKRaMd3YjeIVf@negativedb.abs7crz.mongodb.net/?retryWrites=true&w=majority&appName=negativeDb/negative';
// chn
app.use(cors({
  origin: 'http://localhost:5173', // Allow only your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies (if needed)
}));

MongoClient.connect(url)
.then(async (client) => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SignUp System
app.post('/', (req,res)=>{
  res.send('connected')
});
app.post('/Signdata', CheckUserCredential,userStroe,userEmailVerify);
app.get('/Verify_email_Page/:id',userIsVerifyPage);
app.get('/Verify_email/:id',userIsVerify,sendVerificationSuccessEmail);

//Login System
app.post('/Logindata',userFind);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});