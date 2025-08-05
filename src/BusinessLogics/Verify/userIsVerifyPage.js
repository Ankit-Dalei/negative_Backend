export const userIsVerifyPage = (req, res) => {
  const userId = req.params.id;
  const verifyLink = `http://localhost:4000/Verify_email/${userId}`;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
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
          background-color: #3498db;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.3s;
        }

        .btn:hover {
          background-color: #2980b9;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Email Verification</h1>
        <p>Click the button below to verify your email and activate your account.</p>
        <a class="btn" href="${verifyLink}">Verify</a>
      </div>
    </body>
    </html>
  `);
};
