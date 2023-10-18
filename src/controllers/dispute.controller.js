import db from "../models/index.js";


const { dispute: Dispute, transations: Transaction, users: User } = db;
const Op = db.Sequelize.Op;

// Create a new dispute
export const create = async (req, res) => {
    let disputeObject = {};
    try {
        const { id } = req.params;
    const  reason  = req.body;
        // get the buyer if and seller phone from the transaction with ID
        const transaction = await Transaction.findByPk(id)
        if (transaction) {
            console.log('exist')
            disputeObject.reason = reason;
            disputeObject.transaction_id = id
            disputeObject.buyer_id = transaction.transaction_details.buyer_id;
            disputeObject.seller_phone = transaction.product.seller.phone

        }
        transaction.update({status: 'dispute'})
        //define the dispute object
        const dispute = await Dispute.create(disputeObject);
        if (dispute) {
            console.log('success', dispute)
        }

    return res.status(201).json({dispute, message: 'Dispute Created'});
  } catch (error) {
    return res.status(500).json({ message: 'Dispute resolution is already in progress for this transaction' });
  }
};

// Get all disputes
export const getAllDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.findAll();
    return res.status(200).json(disputes);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//get Disputes for user by Id
export const getUserDisputeById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        const disputes = await Dispute.findAll({
            where: {
                [Op.or]: [
                    { 'seller_phone': user.phone },
                    { 'buyer_id': id }
                ]
            }
        })
        if (!disputes) {
            return res.status(404).json({ error: 'Dispute not found for User' });
          }
      
          return res.status(200).json(disputes);
    } catch (error) {
        
    }
}

// Get dispute by ID
export const getDisputeById = async (req, res) => {
  try {
    const { id } = req.params;
    const dispute = await Dispute.findByPk(id);

    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    return res.status(200).json(dispute);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
