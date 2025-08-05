import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const userEmailVerify = async (req,res,next) => {
  const user = req.createdUser;
  try {
    const verificationLink = `${process.env.verificationLink}${user._id}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
      
    });
    const mailOptions = {
      from: '"Negative" negative.verify.mail@gmail.com',
      to: user.email,
      subject: 'Verify Your Email',
      html: `
        <h2>Email Verification</h2>
        <p>Please click the button below to verify your email address.</p>
        <a href="${verificationLink}" style="
          display:inline-block;
          padding:10px 20px;
          background-color:#28a745;
          color:white;
          text-decoration:none;
          border-radius:5px;
        ">Verify Email</a>
        <p>If the button doesn’t work, use this link:</p>
        <p>${verificationLink}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${user.email}`);
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }
};
