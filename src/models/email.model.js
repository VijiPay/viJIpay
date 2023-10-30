import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const { SES_SMTP_PASSWORD, SES_SMTP_USERNAME }= process.env;
const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com', // Change this to your SES region
  port: 465,
  secure: true, // use SSL
  auth: {
    user: SES_SMTP_USERNAME,
    pass: SES_SMTP_PASSWORD,
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: 'no-reply@vijipay.ng',
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export default sendEmail;
