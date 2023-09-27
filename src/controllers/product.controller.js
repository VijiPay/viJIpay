import db from '../models/index.js';
import axios from 'axios';
import JijiProductModel from '../models/jiji.product.js';

const { Product, User, Transaction } = db;
const Op = db.Sequelize.Op;
// extract the product ID frim the product url
const extractProductId = (mainUrl) => {
    const regex = /\/([^\/]+)-(\w+)\.html/;
    const match = mainUrl.match(regex);

    if (match && match[2]) {
        return match[2];
    } else {
        return null;
    }
}
// create the endpoint that will be used to fetch the product
const createGetEndpoint = (mainUrl) =>{
    const productId = extractProductId(mainUrl);
    if (productId) {
        // Construct the GET endpoint URL
        const getEndpoint = `https://jiji.ng/api_web/v1/item/${productId}`;
        return getEndpoint;
    } else {
        return null;
    }
}
// get the product information from JIJI
export const getProductInfo = async (req, res) => {
    try {
        const mainUrl = req.body.mainUrl;
        const getEndpoint = createGetEndpoint(mainUrl);
        if (getEndpoint) {
            const response = await axios.get(getEndpoint, { timeout: 5000 });
            const product = new JijiProductModel(response.data);
            res.send(product);
        } else {
            res.status(400).send('Invalid URL');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}

// create the escrow transaction
export const create = async (req, res) =>{
    try {
        // get the product info, buyerId, and transaction details
        const { product, buyer_id, transaction_details } = req.body;
        const buyer = await User.findByPk(buyer_id);
        // check if buyer if exist

        // extract the seller id from the product info

        // check if the seller id exist in the database

        // if exist, retrieve the details

        // compare and assign the user(seller) id to the transaction object

        //if  not exist, extract the phone number from the product object

        // save the transaction object

        // send notification to both parties
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
        
    }
