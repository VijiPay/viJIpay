import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import formData from 'form-data';
import  Mailgun  from 'mailgun.js';

dotenv.config();
const { SMTP_PASSWORD, SMTP_USERNAME, SMTP_SENDING_KEY, SMTP_DOMAIN }= process.env;


const mailgun = new Mailgun(formData)
const client = mailgun.client({username: 'api', key: SMTP_SENDING_KEY});



// const transporter = nodemailer.createTransport({
//   host: 'smtp.mailgun.org',
//   port: 587,
//   secure: true, // use SSL
//   auth: {
//     user: SMTP_USERNAME,
//     pass: SMTP_PASSWORD,
//   },
// });

const sendEmail = async (to, subject, htmlContent) => {
  const messageData = {
    from: 'Vijipay Escrow <no-reply@mail.vijipay.ng>',
    to,
    subject,
    html: htmlContent,
  };

  client.messages.create(SMTP_DOMAIN, messageData)
  .then((res)=>{
    console.log(res)
  })
  .catch((err) =>{
    console.error(err);
  })

  // try {
  //   const info = await transporter.sendMail(messageDate);
  //   console.log('Email sent:', info.messageId);
  //   return true;
  // } catch (error) {
  //   console.error('Error sending email:', error);
  //   return false;
  // }
};

export default sendEmail;
