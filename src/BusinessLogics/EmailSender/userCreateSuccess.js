import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { driveStoreTables } from '../../Schemas/driveStoreTables.js';
import { UserMainModel } from '../../Models/userCloudMainModel.js';

dotenv.config();

export const sendVerificationSuccessEmail = async (req, res, next) => {
  const user = req.createdUser;

  // Nodemailer Transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });

  const mailOptions = {
    from: '"Negative-User-Created" negative.verify.mail@gmail.com',
    to: user.email,
    subject: '✅ Email Verified Successfully!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #4caf50;">Hi ${user.username},</h2>
          <p>🎉 Your email has been successfully verified.</p>
          <p>You're now part of our community. Feel free to explore and enjoy all the features we offer!</p>
          <a href="${process.env.LOGIN}" style="display: inline-block; padding: 12px 20px; background-color: #4caf50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Go to Login</a>
          <p style="margin-top: 40px; font-size: 12px; color: #888;">If you did not perform this action, please ignore this email.</p>
        </div>
      </div>
    `
  };

  // Send the email
  

  try {
    const collectionName = String(user._id);
    UserMainModel(collectionName)
    await transporter.sendMail(mailOptions);
  } catch (err) {
    res.send("Error creating user-specific collection:", err);
  }
};