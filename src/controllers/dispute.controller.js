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
            disputeObject.title = `Dispute on ${transaction.product.advert.title}`
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
    return res.status(500).json({ message: error });
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
    const dispute = await Dispute.findOne({
      where: {
        transaction_id: id
      }
    });
    
    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }
    const buyer = await User.findByPk(dispute.buyer_id)
    const seller = await User.findOne({
      where: {
        phone: dispute.seller_phone
      }
    })
    if (!seller) {
      return res.status(404).json({dispute, buyer, message: 'Seller did not register on vijiPay or might have changed phone number. Contact support immediately'})
    }

    return res.status(200).json({dispute, buyer, seller});
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// end a Dispute
export const end = async (req, res) => {
  try {
    const { id } = req.params;
    const dispute = await Dispute.findOne({
      where: {
        transaction_id: id
      }
    });
    
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }
    const transaction = await Transaction.findByPk(dispute.transaction_id)
    if (transaction) {
      transaction.update({status: 'completed'})
    }
    dispute.update({status: 'closed', decision: 'closed by buyer'})



    return res.status(200).json({message: 'Dispute closed!'});
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong! try again later.' });
  }
};
