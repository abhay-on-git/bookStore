const nodemailer = require("nodemailer");
require('dotenv').config()
exports.sendmail = (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Corrected SMTP host
    port: 465,
    secure: true, // Must be true for port 465
    auth: {
      user: process.env.mail, // Use environment variables
      pass: process.env.pass, // Use environment variables
    },
  });

  const mailOptions = {
    from: "Aris Pvt Ltd <abhayagnihotri1585@gmail.com>", // Sender address
    to: req.body.email, // Recipient address
    subject: "NEWSLETTER SUBSCRIPTION",
    html: `<h1>Welcome to Bookstore.</h1>
           <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum, earum.</p>
           <button>Explore More</button>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Failed to send email: " + error.message);
    }
    console.log("Email sent: ", info.response);
    return res.send(
      `<h1 style='text-align:center;color: tomato; margin-top:10%'><span style='font-size:60px;'>✔️</span> <br />Email Sent! Check your inbox, <br/>check spam if not found in inbox.</h1> 
      <div style="display: flex; justify-content: center; align-items: center; height: auto; margin: 0;">
  <a href="/" style="
    display: inline-block;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
  " onmouseover="this.style.backgroundColor='#0056b3'; this.style.boxShadow='0px 4px 8px rgba(0,0,0,0.2)';" onmouseout="this.style.backgroundColor='#007bff'; this.style.boxShadow='none';">
    Home
  </a>
</div>
 `
      
    );
  });
};
