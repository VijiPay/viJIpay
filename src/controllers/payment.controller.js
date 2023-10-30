
import db from "../models/index.js";
import axios from "axios";
import messages from "../models/message.model.js";

const { payments: Payment, mail, transactions:Transaction , users: User } = db;
const Op = db.Sequelize.Op;
const header = {
  "Content-Type": "application/json",
  Authorization: `Bearer sk_test_8d11b41c279986a162d7793bdb24d58a3a38d146`,
};
// save payment details to DB

export const savePaymentData = async (req, res) => {
  try {
    // get the product info, and transaction details from the request body
    const { data } = req.body;
    const id = data.transactionId;
    const payment = await Payment.findOne({
      where: {
        transactionId: id,
        success: false,
      },
    });
    if (!payment) {
      const savePayment = await Payment.create(data);
      return res
        .status(200)
        .json({
          ref: savePayment.reference,
          message: "Payment Saved and ref Generated",
        });
    }

    return res
      .status(200)
      .json({ ref: payment.reference, message: "Payment Ref Fetched" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// get Transaction payment status
export const status = async (req, res) => {
  const { ref } = req.body;
  let dbTotal;
  let payment;
  try {
    const transaction = await Payment.findOne({
      where: {
        reference: ref,
      },
    });

    if (transaction) {
       dbTotal = transaction.totalCollected
    }
      
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${ref}`,
      {
        headers: header,
      }
    );
      
    if (response) {
      const resp = response.data.data;
      payment = {
        status: resp.status,
        reference: resp.reference,
        amount: Number(String(resp.amount).slice(0, -2)),
      };

        if (dbTotal == payment.amount && payment.status === "success") {
           const updatePay = await Payment.findOne({
                where: {
                  reference: ref
              }
          })
          await updatePay.update({ success: true });
          let msg = {}
          //get transaction name fromtransaction usign ID
          const txn = await transactionsModel.findByPk(transaction.id)
          // check if seller exists
          const sellerr = await User.findOne({
            where: {
              phone: transaction.sellerId
            }
          })
          if (txn) {
            msg = {
              name: txn.product.advert.title,
              amount:txn.transaction_details.amount
            }
          }
          if (sellerr && sellerr.isSeller) {
            await mail(sellerr.email, 'Payment Recieved and Confirmed', messages.paymentReceivedFromBuyer(msg.name, msg.amount))
          }
        return res
          .status(200)
          .send({ message: "Payment Confirmed", data: payment, id: transaction.transactionId });
        }
        if (dbTotal == payment.amount && payment.status !== "success") {
          
          const transaction = await Transaction.findOne({
            where: {
                id: transaction.transactionId
              }
          })
          if (transaction) {
            transaction.update({ status: 'pending' });
          }
        return res
          .status(200)
          .send({
            message: "Payment is Pending Confirmation",
            data: payment,
          });
        }
        if (dbTotal != payment.amount && payment.status === "success") {
          console.log(dbTotal, payment.amount, typeof(dbTotal), typeof(payment.amount))
            res
              .status(200)
              .send({
                message: "You Sent a Wrong Amount",
                data: payment,
              });
          }
    } else {
      res.status(200).send({ message: "no response" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};


// Helper function to get bank names and codes
export const getBanks = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/bank`,
      {
        headers: header
      }
    );

    const { status, data } = response.data;

    if (status && data && data.length > 0) {
      const bankNames = data.map((bank) => ({ name: bank.name, code: bank.code }));
      res.status(200).json(bankNames);
    } else {
      res.statn({ error: "No bank names found." });
    }
  } catch (error) {
    console.error("Error retrieving bank names:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// validate the users account details
export const validateAccountDetails = async (req, res) => {
  const { accountNumber, bankCode } = req.body
console.log(req.body, typeof(accountNumber))
  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers:header,
      }
    );
    const { data } = response
    if (data) {
      res.send(data)
    }
  } catch (error) {
    res.send(error)
    // console.log(error)
  }
}