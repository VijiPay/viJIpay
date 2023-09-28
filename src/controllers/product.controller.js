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

            // Define a function to fetch product info
            const fetchProductInfo = async () => {
                const response = await axios.get(getEndpoint, { timeout: 5000 });
                productRetry = new JijiProductModel(response.data);
            };

            // Check if phone number is empty
            if (!product.seller.phone) {
                res.send({message: {
                    '0': 'We were unable to fetch the Seller\'s phone number.',
                    '1': 'Please go back to the Product page and Copy the Seller\'s phone number manually.',
                    '2': 'Then, paste it in the Phone Number field or try again.'
                }, product
                });
            } else {
                res.send(product);
            }
        } else {
            res.status(400).send('Invalid URL');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}


// create the escrow transaction
// export const create = async (req, res) => {
//     try {
//         // get the product info, and transaction details from the request body
//         const { product, transaction_details } = req.body;

       

//         const seller_details = {
//             id: seller.id,
//             name: seller.name,
//             email: seller.email // Assuming your User model has a field named email
//             // Add any other details you need
//         };

//         const transaction = await Transaction.create({
//             product_info: product,
//             buyer_id: buyer.id,
//             seller_id: seller_details.id,
//             ...transaction_details
//         });

//         // Implement notification logic here

//         return res.status(200).json({ message: 'Transaction created successfully' });
//     } catch (error) {
//         console.error(error.message);
//         return res.status(500).json({ message: 'Server Error' });
//     }
// }

