import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function requestPasswordConfirmationCode(route: string){

    let id = ''
    const userSession = await utils_getAsyncData('userSession')
    if(userSession.value){
        id = JSON.parse(userSession.value).id
    }else{
        return
    }

    try {
        const response = await fetch(`${apiUrl}/api/requests/${route}/requestPasswordConfirmationCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
                "User-Agent": userAgent,
                "Authorization": authorization
            },
            body: JSON.stringify({ ...(route === "gallery" ? {gallery_id: id} : {id: id})}),
        })
        .then(async (res) => {
            const result = await res.json();

            return { isOk: res.ok, message: result.message };
        })

        return response
    }catch(error){
        return {
            isOk: false,
            message: 'Error getting confirmation code'
        }
    }
}