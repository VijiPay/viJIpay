import db from '../models/index.js';

const { payments:Payment } = db;
const Op = db.Sequelize.Op;

// save payment details to DB

export const savePaymentData = async (req, res) => { 
    try {
        // get the product info, and transaction details from the request body
        const { data } = req.body;
        const id = data.transactionId
        console.log(id)
        const payment = await Payment.findOne({
            where: {
                transactionId: id,
                success: false
            }
        });
        if (!payment) {
            console.log('nothing found')
            const savePayment = await Payment.create(data);
            return res.status(200).json({ref: savePayment.reference, message: 'Payment Saved and ref Generated' });
        }
        
        return res.status(200).json({ ref: payment.reference, message: 'Payment Ref Fetched' });
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

