import express from 'express';
import * as product from '../controllers/product.controller.js';
import * as transaction from '../controllers/transaction.controller.js';
import { verifySignUp, authJwt } from '../middleware/index.js';
import * as user from '../controllers/user.controller.js';
import * as payment from '../controllers/payment.controller.js';
import * as dispute from '../controllers/dispute.controller.js';
import * as adminDashboard from '../controllers/admin.controller.js';

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
        "You are viewingy viJIPay. contact developer: davidshemang@gmail.com or whatsapp https://wa.me/+2348035542225",
    });
});
// get product information from jiji using product url
router.post('/api/v1/getProductInfo', product.getProductInfo);

// create escrow transaction
router.post('/api/v1/create', [authJwt.verifyToken], transaction.create);

// update escrow transaction
router.put('/api/v1/update/:id', [authJwt.verifyToken], transaction.update);

// get escrow transaction by id
router.get('/api/v1/transaction/:id',  [authJwt.verifyToken], transaction.getTransaction);

// get all escrow transactions -ADMIN ONLY
router.get('/api/v1/transactions', [authJwt.isAdmin], transaction.getAllTransactions);

// get all escrow transactions by user id
router.get('/api/v1/transactions/:id', [authJwt.verifyToken], transaction.getAllTransactionsByUserId);

// get a user's escrow transactions count by user id and status ADMIN ONLY
router.get('/api/v1/transactions/:id/:status/count', [authJwt.isAdmin], transaction.findUserTransactionsCountByStatus);

// get all escrow transactions by status ADMIN ONLY
router.get('/api/v1/transactions/status/:status', [authJwt.isAdmin], transaction.findAllTransactionsByStatus);

// get all escrow transactions count by status ADMIN ONLY
router.get('/api/v1/transactions/status/count/:status', [authJwt.isAdmin], transaction.findAllTransactionsCountByStatus); 

// delete escrow transaction by id
router.delete('/api/v1/delete/:id', [authJwt.isAdmin], transaction.deleteTransaction);

// delete all escrow transactions
router.delete('/api/v1/delete', [authJwt.isAdmin], transaction.deleteAllTransactions);

// save Payment to Database
router.post('/api/v1/savepayment', [authJwt.verifyToken], payment.savePaymentData);

// check payment status
router.post('/api/v1/paymentstatus', [authJwt.verifyToken], payment.status);


// :::::::::::::::::::::::::::USER ROUTES::::::::::::::::::::::::::::::::::

//signup
router.post('/api/v1/signup', [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted], user.signup);

//signin
router.post('/api/v1/signin', user.signin);

//send email verification code
router.post('/api/v1/sendverificationcode', [authJwt.verifyToken], user.sendVerificationEmail);

//verify email code
router.post('/api/v1/confirmemail', user.verifyEmail);

//refresh token
router.post("/api/v1/refreshtoken", user.refreshToken)

//forgot password
router.post('/api/v1/forgot-password', user.forgotPassword);

//verify token
router.post('/api/v1/verifyToken', user.verifyResetToken);

//reset password
router.post('/api/v1/reset-password', user.resetPassword);

//verify email
router.get('/verify/:token', user.verifyEmail);

//delete user
router.delete('/api/v1/user/delete/:id', [authJwt.isAdmin], user.deleteUser);

//get user
router.get('/api/v1/user/:id', [authJwt.verifyToken], user.getUser);

//update user
router.put('/api/v1/update/user/:id', [authJwt.verifyToken], user.update);

// get Banks List
router.get('/api/v1/getbanks', [authJwt.verifyToken], payment.getBanks);

//validate account number
router.post('/api/v1/validateaccount', [authJwt.verifyToken], payment.validateAccountDetails)



// ::::::::::::::::::::::::::::::: Disputes ::::::::::::::::::::::::::
router.post('/api/v1/dispute/create/:id', [authJwt.verifyToken], dispute.create);
router.get('/api/v1/disputes/:id', [authJwt.verifyToken], dispute.getUserDisputeById)
router.get('/api/v1/dispute/:id', [authJwt.verifyToken], dispute.getDisputeById)
router.post('/api/v1/dispute/end/:id', [authJwt.verifyToken], dispute.end);



// ::::::::::::::::::::::::Admin Dashboard ::::::::::::::::::::::::::
router.get('/api/v1/admin/summary', adminDashboard.adminSummary);
router.get('/api/v1/admin/activedisputes', adminDashboard.listActiveDisputes);
router.post('/api/v1/admin/dispute/:transactionId/close', adminDashboard.closeDispute);


export default router;