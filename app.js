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
document.getElementById('productUrl').innerHTML = mainUrl;
document.getElementById('productInfo').innerHTML = getEndpoint;
