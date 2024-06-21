import { getCurrentMonthAndYear } from "utils/getCurrentMonthAndYear";
import { apiUrl } from "../../constants/apiUrl.constants";
import { getAsyncData } from "utils/asyncStorage.utils";

export async function getSalesActivityData(){
    const { year } = getCurrentMonthAndYear();

    let sessionId = '';
    const userSession = await getAsyncData('userSession')
    if(userSession.value){
        sessionId = JSON.parse(userSession.value).id
    }else{
        return
    }

    try {
        const response = await fetch(`${apiUrl}/api/sales/getActivityById`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: sessionId, year }),
        })
        .then(async (res) => {
            if(!res.ok) return undefined
            const result = await res.json();

            return result;
        })

        return response
    }catch(error){
        return {
            isOk: false,
            body: {message: 'Error fetching gallery artwork highlight'}
        }
    }
}