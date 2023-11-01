
import db from "../models/index.js";
import axios from "axios";
import messages from "../models/message.model.js";

const { payments: Payment, mail, transations: Transaction, users: User } = db;
const Op = db.Sequelize.Op;
const header = {
  "Content-Type": "application/json",
  Authorization: `Bearer sk_test_8d11b41c279986a162d7793bdb24d58a3a38d146`,
};

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
  try {
    const { ref } = req.body;

    const paymentObject = await Payment.findOne({
      where: { reference: ref },
    });

    if (!paymentObject) {
      return res.status(400).send('Invalid Payment Reference');
    }

    const dbTotal = paymentObject.totalCollected;
    const transactionId = paymentObject.transactionId;

    const [paymentResponse, transaction] = await Promise.all([
      axios.get(`https://api.paystack.co/transaction/verify/${ref}`, { headers: header, timeout: 10000 }),
      Transaction.findOne({ where: { id: transactionId } })
    ]);

    const paymentData = paymentResponse.data.data;
    const paymentAmount = Number(String(paymentData.amount).slice(0, -2));

    if (dbTotal !== paymentAmount) {
      return res.status(200).send({
        message: "You Sent a Wrong Amount",
        data: { status: paymentData.status, reference: paymentData.reference, amount: paymentAmount, id: transactionId },
      });
    }

    if (paymentData.status === "success") {
      await Payment.update({ success: true }, { where: { reference: ref } });

      if (transaction) {
        await transaction.update({ status: 'pending' });
      }

      const seller = await User.findOne({ where: { phone: paymentObject.sellerId } });

      if (seller && seller.isSeller) {
        const msg = {
          name: transaction.product.advert.title,
          amount: transaction.transaction_details.amount
        };
        await mail(seller.email, 'Payment Received and Confirmed', messages.paymentReceivedFromBuyer(msg.name, msg.amount));
      }

      return res.status(200).send({
        message: "Payment Confirmed",
        data: { status: paymentData.status, reference: paymentData.reference, amount: paymentAmount },
        id: transactionId
      });
    } else {
      return res.status(200).send({
        message: "Payment is Pending Confirmation",
        data: { status: paymentData.status, reference: paymentData.reference, amount: paymentAmount },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:'An error occurred. Check network connection'});
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