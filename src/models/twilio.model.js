
import twilio  from "twilio";

const { TWILIO_TOKEN, TWILIO_SID, TWILIO_NUMBER} = process.env;

const client = twilio(TWILIO_SID, TWILIO_TOKEN);

const createTransaction = (recipient, msg) => {
    client.messages.create({
        body: msg,
        // from: `whatsapp:${TWILIO_NUMBER}`,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${recipient}`
    })
        .then(message => console.log(message.sid));
    
}
const paymentRecieved = (recipient, msg) => {
    client.messages.create({
        body: msg,
        from: TWILIO_NUMBER,
        to: recipient
    })
        .then(message => console.log(message.sid));
    
}
const payoutSent = (recipient, msg) => {
    client.messages.create({
        body: msg,
        from: TWILIO_NUMBER,
        to: recipient
    })
        .then(message => console.log(message.sid));
    
}

const sendSmsMessage = { createTransaction, paymentRecieved, payoutSent }

export default sendSmsMessage;
