import db from '../models/index.js';

const {transations:Transaction, users:User } = db;
const Op = db.Sequelize.Op;

export const create = async (req, res) => { 
    try {
        // get the product info, and transaction details from the request body
        const { prod, tx_details } = req.body;
        const product = JSON.parse(prod);
        const transaction_details = JSON.parse(tx_details);

        const seller_id = product.seller.id;

        const seller = await User.findByPk(seller_id);

        if (!seller) {
            const phone = product.seller.phone || '090111';

            const transaction = await Transaction.create({
                product: product,
                transaction_details:transaction_details
            });

             // Send SMS notification to the supplied phone
             console.log('Send notification to seller with phone number: ' + phone)
            return res.status(200).json({ message: 'Transaction created Successfully' });
        }


        const transaction = await Transaction.create({
            product: product,
            transaction_details: transaction_details
        });
        // Send SMS and Email notification to the seller
        console.log('Send sms and email notification to the seller with id: ' + seller_id)

        return res.status(200).json({ message: 'Transaction created Successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}
