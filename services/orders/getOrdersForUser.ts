import { OrderTabsTypes } from "screens/orders/Orders";
import { apiUrl } from "../../constants/apiUrl.constants";
import { utils_getAsyncData } from "utils/utils_asyncStorage";

export async function getOrdersForUser(){

    let userId = ''
    const userSession = await utils_getAsyncData('userSession')
    if(userSession.value){
        userId = JSON.parse(userSession.value).id
    }

    //if there isn't a user id
    if(userId.length < 1) return

    let url = apiUrl + '/api/orders/getOrdersByUserId'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userId}),
        })
        .then(async (res) => {
            const result = await res.json();
            return { isOk: res.ok, message: result.message, data: result.data};
        })

        return response
    }catch(error){
        console.log(error)
        return {
            isOk: false,
            message: 'Error fetching orders'
        }
    }

}