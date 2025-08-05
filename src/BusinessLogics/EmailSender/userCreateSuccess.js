import nodemailer from 'nodemailer';

export const sendVerificationSuccessEmail = async (req,res,next) => {
  const user = req.createdUser;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'negative.verify.mail@gmail.com',
      pass: 'fqab onep rfft inmn'
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
          <a href="http://localhost:5173/login" style="display: inline-block; padding: 12px 20px; background-color: #4caf50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Go to Login</a>
          <p style="margin-top: 40px; font-size: 12px; color: #888;">If you did not perform this action, please ignore this email.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};
