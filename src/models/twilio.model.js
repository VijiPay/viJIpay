import twilio from "twilio";

const { TWILIO_TOKEN, TWILIO_SID, TWILIO_NUMBER } = process.env;

const client = twilio(TWILIO_SID, TWILIO_TOKEN);
const messagingServiceSid = "MGaf333af9f0af0ffe2bc041f3f87f0899";

const createTransaction = (recipient, msg) => {
  client.messages
    .create({
        shortenUrls: true,
      body: msg,
      messagingServiceSid,
      to: recipient,
    })
    .then((message) => console.log(message.sid));
};
const paymentRecieved = (recipient, msg) => {
  client.messages
    .create({
        shortenUrls: true,
      body: msg,
      messagingServiceSid,
      to: recipient,
    })
    .then((message) => console.log(message.sid));
};
const payoutSent = (recipient, msg) => {
  client.messages
    .create({
        shortenUrls: true,
      body: msg,
      messagingServiceSid,
      to: recipient,
    })
    .then((message) => console.log(message.sid));
};

const sendSmsMessage = { createTransaction, paymentRecieved, payoutSent };

export default sendSmsMessage;
