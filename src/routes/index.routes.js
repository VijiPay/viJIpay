import express from 'express';
import * as product from '../controllers/product.controller.js';
import * as transaction from '../controllers/transaction.controller.js';
import { verifySignUp, authJwt } from '../middleware/index.js';
import * as user from '../controllers/user.controller.js';
import * as payment from '../controllers/payment.controller.js';
import * as dispute from '../controllers/dispute.controller.js';

const router = express.Router();

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers",
    "Authorization, Origin, Content-Type, Accept");
  next();
});
// simple route to display on mainpage
router.get("/", (req, res) => {
    res.json({
      message:
        "You are viewingy viJIPay. contact developer: davidshemang@gmail.com",
    });
});
// get product information from jiji using product url
router.post('/api/v1/getProductInfo', product.getProductInfo);

// create escrow transaction
router.post('/api/v1/create', transaction.create);

// update escrow transaction
router.put('/api/v1/update/:id', transaction.update);

// get escrow transaction by id
router.get('/api/v1/transaction/:id', transaction.getTransaction);

// get all escrow transactions
router.get('/api/v1/transactions', transaction.getAllTransactions);

// get all escrow transactions by user id
router.get('/api/v1/transactions/:id', transaction.getAllTransactionsByUserId);

// get a user's escrow transactions count by user id and status
router.get('/api/v1/transactions/:id/:status/count', transaction.findUserTransactionsCountByStatus);

// get all escrow transactions by status
router.get('/api/v1/transactions/status/:status', transaction.findAllTransactionsByStatus);

// get all escrow transactions count by status
router.get('/api/v1/transactions/status/count/:status', transaction.findAllTransactionsCountByStatus); 

// delete escrow transaction by id
router.delete('/api/v1/delete/:id', transaction.deleteTransaction);

// delete all escrow transactions
router.delete('/api/v1/delete', transaction.deleteAllTransactions);

// save Payment to Database
router.post('/api/v1/savepayment', payment.savePaymentData);

// check payment status
router.post('/api/v1/paymentstatus', payment.status);


// :::::::::::::::::::::::::::USER ROUTES::::::::::::::::::::::::::::::::::

//signup
router.post('/api/v1/signup', [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted], user.signup);

//signin
router.post('/api/v1/signin', user.signin);

//send email verification code
router.post('/api/v1/sendverificationcode', user.sendVerificationEmail);

//verify email code
router.get('/api/v1/confirmemail/:token', user.verifyEmail);

//refresh token
router.post("/api/v1/refreshtoken", user.refreshToken)

//forgot password
router.post('/api/v1/forgotPassword', user.forgotPassword);

//verify token
router.post('/api/v1/verifyToken', user.verifyResetToken);

//reset password
router.post('/api/v1/resetPassword', user.resetPassword);

//verify email
router.get('/verify/:token', user.verifyEmail);

//delete user
router.delete('/api/v1/user/delete/:id', user.deleteUser);

//get user
router.get('/api/v1/user/:id', user.getUser);

//update user
router.put('/api/v1/update/user/:id', user.update);

// get Banks List
router.get('/api/v1/getbanks', payment.getBanks);

//validate account number
router.post('/api/v1/validateaccount', payment.validateAccountDetails)



// ::::::::::::::::::::::::::::::: Disputes ::::::::::::::::::::::::::
router.post('/api/v1/dispute/create/:id', dispute.create);
router.get('/api/v1/disputes/:id', dispute.getUserDisputeById)
router.get('/api/v1/dispute/:id', dispute.getDisputeById)
router.post('/api/v1/dispute/end/:id', dispute.end);

export default router;