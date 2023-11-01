import axios from 'axios';
import JijiProductModel from '../models/jiji.product.js';

// extract the product ID frim the product url
const extractProductId = (mainUrl) => {
    const regex = /\/([^\/]+)-(\w+)\.html/;
    const match = mainUrl.match(regex);

    return match && match[2] ? match[2] : null;
}

// create the endpoint that will be used to fetch the product
const createGetEndpoint = (mainUrl) => {
    const productId = extractProductId(mainUrl);
   
    return productId ? `https://jiji.ng/api_web/v1/item/${productId}` : null;
}

// get the product information from JIJI
export const getProductInfo = async (req, res) => {
    try {
        const mainUrl = req.body.mainUrl;
        const getEndpoint = createGetEndpoint(mainUrl);

        if (!getEndpoint) {
            return res.status(400).json({ message: 'No valid link found!' });
        }

        const response = await axios.get(getEndpoint, { timeout: 5000 });
        const product = new JijiProductModel(response.data);

        if (!product.seller.phone) {
            return res.send({
                message: {
                    'one': 'We were unable to fetch the Seller\'s phone number',
                    'two': 'Please go back to the Product page and Copy the Seller\'s phone number manually',
                    'three': 'Then, paste it in the Phone Number field to continue',
                    'four': 'or try again to automatically fetch the phone number'
                },
                product
            });
        } else {
            return res.send({ message: {}, product });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fectch product from jiji' });
    }
}