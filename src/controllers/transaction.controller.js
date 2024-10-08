import db from '../models/index.js';
import messages from '../models/message.model.js';
import sendSmsMessage from '../models/twilio.model.js';


const {transations:Transaction, users:User, mail } = db;
const Op = db.Sequelize.Op;

export const create = async (req, res) => { 
    try {
        // get the product info, and transaction details from the request body
        const { prod, tx_details } = req.body;
        const product = prod;
        const transaction_details = tx_details;

        const seller_phone = product.seller.phone;

        const seller = await User.findOne({
            where: {
                phone: seller_phone
            }
            });

        if (!seller) {
            const phone = product.seller.phone;
            const transaction = await Transaction.create({
                product: product,
                transaction_details:transaction_details
            });

            // Send SMS notification to the supplied phone
            sendSmsMessage.createTransaction(phone, messages.transactionCreatedSMS(product.advert.title, transaction_details.amount, transaction.id));
            
            return res.status(200).json({id: transaction.id, message: 'Transaction created Successfully' });
        }


        const transaction = await Transaction.create({
            product: product,
            transaction_details: transaction_details
        });
        // Send SMS and Email notification to the seller
        await mail(seller.email, 'New Order via vijiPay', messages.transactionCreated(product.advert.title, transaction_details.amount))
        console.log('Send sms and email notification to the seller with id: ' + seller.email, seller.phone)
        sendSmsMessage.createTransaction(seller.phone, messages.transactionCreatedSMS(product.advert.title, transaction_details.amount))
        return res.status(200).json({id: transaction.id, message: 'Transaction created Successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

// update transaction status
export const update = async (req, res) => {
    const  {status}  = req.body;

    const { id } = req.params;

    console.log(status, id)

    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        const updatedTransaction = await transaction.update({ status: status });
        return res.status(200).json({ transaction: updatedTransaction });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}
// get transaction by id
export const getTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        return res.status(200).json({ transaction: transaction });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

// get all transactions
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        if (!transactions) {
            return res.status(404).json({ message: 'No Transaction found' });
        }
        return res.status(200).json({ transactions: transactions });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

// get all transactions for a user
export const getAllTransactionsByUserId = async (req, res) => {

    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

            const transactions = await Transaction.findAll({
                where: {
                    [Op.or]: [
                        { 'product.seller.phone': user.phone },
                        { 'transaction_details.buyer_id': id }
                    ]
                }
            })
            return res.status(200).json({ transactions, isSeller: true });
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

// delete transaction by id where status is created
export const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        if (transaction.status !== 'created') {
            return res.status(400).json({ message: 'Transaction cannot be deleted' });
        }
        await transaction.destroy();
        return res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

//delete all transactions
export const deleteAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        if (!transactions) {
            return res.status(404).json({ message: 'No Transaction found' });
        }
        await Transaction.destroy({ where: {}, truncate: false });
        return res.status(200).json({ message: 'Transactions deleted successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

//find all transactions by status
export const findAllTransactionsByStatus = async (req, res) => {
    const { status } = req.params;
    try {
        const transactions = await Transaction.findAll({
            where: {
                status: status
            }
        });
        if (!transactions) {
            return res.status(404).json({ message: 'No Transaction found' });
        }
        return res.status(200).json({ transactions: transactions });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

//get single user transactions count by status
export const findUserTransactionsCountByStatus = async (req, res) => {
    const { id, status } = req.params;
    try {
        const transactions = await Transaction.findAll({
            where: {
                [Op.or]: [{ 'product.seller.id': id }, { 'transaction_details.buyer.id': id }],
                status: status
            }
        });
        if (!transactions) {
            return res.status(404).json({ message: 'No Transaction found' });
        }
        return res.status(200).json({ transactions: transactions.length });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

//find all transactions count by status
export const findAllTransactionsCountByStatus = async (req, res) => {
    const { status } = req.params;
    try {
        const transactions = await Transaction.findAll({
            where: {
                status: status
            }
        });
        if (!transactions) {
            return res.status(404).json({ message: 'No Transaction found' });
        }
        return res.status(200).json({ transactions: transactions.length });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}