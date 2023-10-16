import db from "../models/index.js";
import axios from "axios";

const { payments: Payment } = db;
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

// get Transaction status
export const status = async (req, res) => {
  const { ref } = req.body;
  let txn;
  let payment;
  try {
    const transaction = await Payment.findOne({
      where: {
        reference: ref,
      },
    });
    if (transaction) {
      txn = {
        reference: transaction.reference,
        amount: transaction.totalCollected,
      };
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
        amount: resp.amount,
        fee: resp.fees,
      };

        if (txn.amount == payment.amount && payment.status == "success") {
           const updatePay = await Payment.findOne({
                where: {
                  reference: ref
              }
          })
          await updatePay.update({success: true});
        res
          .status(200)
          .send({ message: "Payment Confirmed", data: payment, id: transaction.transactionId });
      } else if (txn.amount == payment.amount && payment.status != "success") {

        res
          .status(200)
          .send({
            message: "Payment is Pending Confirmation",
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
