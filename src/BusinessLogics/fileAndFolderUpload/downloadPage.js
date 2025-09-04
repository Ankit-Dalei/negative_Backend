import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

dotenv.config();

export const downloadPage = (req, res) => {
  const token = req.query.token;
  const fileKey = JSON.parse(req.query.str);
   // Decode token
   let decoded;
   try {
       decoded = jwt.verify(token, JWT_SECRET);
   } catch (err) {
       return res.status(401).json({ error: "Invalid or expired token" });
   }
  const userId = decoded.bucketName;
  let str=JSON.stringify(fileKey)

  const obj = { str, userId };

  const params = new URLSearchParams(obj).toString();
  let downloadLink=`${process.env.URL}/DownloadZipFile?${params}`

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Download Files</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #74ebd5, #ACB6E5);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          color: #333;
        }
    
        .container {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          width: 90%;
        }
    
        h1 {
          color: #2c3e50;
        }
    
        p {
          margin: 20px 0;
          font-size: 16px;
        }
    
        .btn {
          padding: 12px 24px;
          font-size: 16px;
          border: none;
          background-color: #27ae60;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.3s;
        }
    
        .btn:hover {
          background-color: #1e8449;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Your Files are Ready</h1>
        <p>Click the button below to download your files.</p>
        <a class="btn" href="${downloadLink}">Download Now</a>
      </div>
    </body>
    </html>
  `);
};
