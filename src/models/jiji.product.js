class JijiProductModel {
    constructor(data) {
        this.advert = {
            abuse_reported: data.advert.abuse_reported,
            sold_reported: data.advert.sold_reported,
            admin_info: {},
            attrs: data.advert.attrs,
            category_name: data.advert.category_name,
            date: data.advert.date,
            date_created: data.advert.date_created,
            date_moderated: data.advert.date_moderated,
            description: data.advert.description,
            id: data.advert.id,
            images: data.advert.images,
            images_data: data.advert.images_data,
            is_active: data.advert.is_active,
            is_closed: data.advert.is_closed,
            is_declined: data.advert.is_declined,
            is_on_moderation: data.advert.is_on_moderation,
            price: {
                value: data.advert.price.value,
                type: data.advert.price.type,
                is_closed: data.advert.price.is_closed
            },
            price_history: data.advert.price_history,
            region_name: data.advert.region_name,
            region_slug: data.advert.region_slug,
            region_text: data.advert.region_text,
            status: data.advert.status,
            status_color: data.advert.status_color,
            title: data.advert.title,
            title_labels: data.advert.title_labels,
            url: data.advert.url
        };
        
        this.seller = {
            advert_id: data.seller.advert_id,
            advert_price: data.seller.advert_price,
            adverts_count: data.seller.adverts_count,
            chat_on: data.seller.chat_on,
            date_created: data.seller.date_created,
            feedback_count: data.seller.feedback_count,
            feedbacks: data.seller.feedbacks,
            guid: data.seller.guid,
            id: data.seller.id,
            image_url: data.seller.image_url,
            last_seen: data.seller.last_seen,
            name: data.seller.name,
            phone: data.seller.phone,
            user_phones: data.seller.user_phones,
            status: data.seller.status,
            user_response_time: data.seller.user_response_time
        };
        
        this.adult_only = data.adult_only;
    }
}

export default JijiProductModel;