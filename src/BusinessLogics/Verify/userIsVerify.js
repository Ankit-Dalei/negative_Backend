import { User } from "../../Models/userModel.js";
import dotenv from 'dotenv';
import { sendVerificationSuccessEmail } from "../EmailSender/userCreateSuccess.js";

dotenv.config();

export const userIsVerify = async (req, res, next) => {
  try {
    const id = req.params.id || req.body.userId || req.headers['id'];

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isVerified: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await User.findOne({ _id: id });
    req.createdUser = user;
    await sendVerificationSuccessEmail(user)
    return res.status(200).send(`
      <html>
        <head>
          <title>Verification Success</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              margin-top: 100px;
            }
            a {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
            }
            a:hover {
              background-color: #45a049;
            }
          </style>
        </head>
        <body>
          <h1>✅ Your account has been verified!</h1>
          <a href="${process.env.LOGIN}">Back to Login</a>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
