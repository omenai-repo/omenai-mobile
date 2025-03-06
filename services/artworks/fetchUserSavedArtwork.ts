import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";
import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { logout } from "utils/logout.utils";

export async function fetchUserSavedArtworks(){

    let userId = ''
    const userSession = await utils_getAsyncData('userSession')
    if(userSession.value){
        userId = JSON.parse(userSession.value).id
    }
    //if there isn't a user id this should return
    if(userId.length < 1) return

    let url = apiUrl + '/api/artworks/getUserSavedArtworks'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
                "User-Agent": userAgent,
                "Authorization": authorization
            },
            body: JSON.stringify({ id: userId, page: 1 }),
        })
        
            const result = await response.json();
            return { isOk: response.ok, message: result.message, data: result.data};
     
    }catch(error){
        console.log('error' + error)
        return {
            isOk: false,
            body: {message: 'Error fetching saved artworks'}
        }
    }

}