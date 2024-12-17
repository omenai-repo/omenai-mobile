import { apiUrl, originHeader } from "../../constants/apiUrl.constants";
import { utils_getAsyncData } from "utils/utils_asyncStorage";

export async function getOverviewOrders(){

    let userId = ''
    const userSession = await utils_getAsyncData('userSession')
    if(userSession.value){
        userId = JSON.parse(userSession.value).id
    }else{
        return
    }

    try {
        const response = await fetch(`${apiUrl}/api/orders/getOrdersByGalleryId`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
            },
            body: JSON.stringify({ id: userId}),
        })
        .then(async (res) => {
            if (!res.ok) return undefined;
            const result = await res.json();

            return result;
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