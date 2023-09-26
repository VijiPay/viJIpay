import express from 'express';
import * as product from '../controllers/product.controller.js';

const router = express.Router();
// simple route to display on mainpage
router.get("/", (req, res) => {
    res.json({
      message:
        "You are viewingy viJIPay. contact developer: davidshemang@gmail.com",
    });
});
router.post('/api/v1/getProductInfo', product.getProductInfo);

export default router;