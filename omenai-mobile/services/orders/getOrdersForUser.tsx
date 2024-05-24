import { OrderTabsTypes } from "screens/orders/Orders";
import { apiUrl } from "../../constants/apiUrl.constants";
import { getAsyncData } from "utils/asyncStorage.utils";

export async function getOrdersForUser(orderType: OrderTabsTypes){

    let userId = ''
    const userSession = await getAsyncData('userSession')
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
        console.log('error' + error)
        return {
            isOk: false,
            body: {message: 'Error fetching orders'}
        }
    }

}