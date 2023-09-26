import axios from 'axios';
import models from '../models/index.js';

const extractProductId = (mainUrl) => {
    const regex = /\/([^\/]+)-(\w+)\.html/;
    const match = mainUrl.match(regex);

    if (match && match[2]) {
        return match[2];
    } else {
        return null;
    }
}

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

export const getProductInfo = async (req, res) => {
    try {
        const mainUrl = req.body.mainUrl;
        const getEndpoint = createGetEndpoint(mainUrl);
        if (getEndpoint) {
            const response = await axios.get(getEndpoint, { timeout: 5000 });
            const product = new models.ProductModel(response.data);
            console.log(response.data)
            res.send(product);
        } else {
            res.status(400).send('Invalid URL');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}