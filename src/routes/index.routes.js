import express from 'express';
import * as product from '../controllers/product.controller.js';
import * as transaction from '../controllers/transaction.controller.js';

const router = express.Router();
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

export default router;