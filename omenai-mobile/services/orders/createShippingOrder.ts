import { apiUrl } from "../../constants/apiUrl.constants";
import { getAsyncData } from "utils/asyncStorage.utils";

export async function createShippingOrder(
    buyer_id: string,
    art_id: string,
    gallery_id: string,
    save_shipping_address: boolean,
    shipping_address: IndividualAddressTypes
){

    try {
        const response = await fetch(`${apiUrl}/api/orders/createOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                buyer_id,
                art_id,
                gallery_id,
                save_shipping_address,
                shipping_address
            }),
        })
        .then(async (res) => {
            const result = await res.json();
            return { isOk: res.ok, message: result.message};
        })

        return response
    }catch(error){
        console.log('error' + error)
        return {
            isOk: false,
            body: {message: 'Error fetching orders'}
        }
    }
}