import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    optionsSuccessStatus: 200,
    credentials: true,
}
app.use('*', cors(corsOptions));

function extractProductId(mainUrl) {
    const regex = /\/([^\/]+)-(\w+)\.html/;
    const match = mainUrl.match(regex);

    if (match && match[2]) {
        return match[2];
    } else {
        return null;
    }
}



function createGetEndpoint(mainUrl) {
    const productId = extractProductId(mainUrl);
    console.log('ahh '+productId)
    if (productId) {
        // Construct the GET endpoint URL
        const getEndpoint = `https://jiji.ng/api_web/v1/item/${productId}`;
        return getEndpoint;
    } else {
        return null;
    }
}

const mainUrl = 'https://jiji.ng/ajah/audio-and-music-equipment/alctron-pf8-hOtAKT1a0CmEhKQrjn6YNbIA.html?page=1&pos=3&cur_pos=3&ads_per_page=20&ads_count=1170&lid=SndumOx8Dpxtrd72&indexPosition=2';

const getEndpoint = createGetEndpoint(mainUrl);
// document.getElementById('productUrl').innerHTML = mainUrl;
// document.getElementById('productInfo').innerHTML = getEndpoint;

const port = process.env.PORT || 4344;
app.listen(port, () => console.log(`Server running on port ${port}`));
