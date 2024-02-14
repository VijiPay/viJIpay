// Import necessary models and dependencies
import db from '../models/index.js';

const { dispute: Dispute, transations: Transaction, users: User, mail } = db;
const Op = db.Sequelize.Op;


// Endpoint to show all users, all transactions, active transactions, completed transactions, dispute transactions, closed dispute transactions
export const adminSummary = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalTransactions = await Transaction.count();
        const activeTransactions = await Transaction.count({ where: { status: 'active' } });
        const completedTransactions = await Transaction.count({ where: { status: 'completed' } });

        const totalDisputes = await Dispute.count();
        const closedDisputes = await Dispute.count({ where: { status: 'closed' } });

        // Calculate dispute resoultion success rate
        const successRate = (closedDisputes / totalDisputes) * 100;

        const summary = {
            totalUsers,
            totalTransactions,
            activeTransactions,
            completedTransactions,
            totalDisputes,
            closedDisputes,
            successRate
        };

        res.json(summary);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};

// Endpoint to list active disputes
export const listActiveDisputes = async (req, res) => {
    try {
        const disputes = await Dispute.findAll({ where: { status: 'open' } });
        return res.status(200).json(disputes);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Endpoint to update dispute status to mark it as closed
export const closeDispute = async (req, res) => {
    try {
        const  transationId  = req.params.transactionId;
        console.log(transationId)
        const { decision, status } = req.body;

        const dispute = await Dispute.findOne({
            where: {
                transaction_id: transationId
            }
        });

        if (!dispute) {
            return res.status(404).json({ message: 'Dispute not found' });
        }

        await dispute.update({ status, decision });

        return res.status(200).json({ message: `Dispute ${transationId} marked as closed with decision ${decision}` });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};

// Endpoint to list payouts
export const listPayouts = async (req, res) => {
    try {
        // Implement logic to retrieve and return a list of payouts
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Endpoint to mark payout to seller as paid
export const markPayoutAsPaid = async (req, res) => {
    try {
        const { payoutId } = req.params;

        // Implement logic to mark payout as paid in your database

        return res.status(200).json({ message: `Payout ${payoutId} marked as paid` });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};

// Endpoint to get the total number of Users
export const getTotalUsers = async (req, res) => {
    try {
        const totalUsers = await User.count();
        return res.status(200).json({ totalUsers });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

