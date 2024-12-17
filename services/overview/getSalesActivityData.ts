import { getCurrentMonthAndYear } from "utils/utils_getCurrentMonthAndYear";
import { apiUrl, originHeader } from "../../constants/apiUrl.constants";
import { utils_getAsyncData } from "utils/utils_asyncStorage";

export async function getSalesActivityData(){
    const { year } = getCurrentMonthAndYear();

    let sessionId = '';
    const userSession = await utils_getAsyncData('userSession')
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
                'Origin': originHeader,
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