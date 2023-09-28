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

export default router;