import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function fetchPopularArtworks(){

    let userId = ''
    const userSession = await utils_getAsyncData('userSession')
    if(userSession.value){
        userId = JSON.parse(userSession.value).id
    }else{
        return
    }

    try {
        const response = await fetch(`${apiUrl}/api/artworks/getPopularArtworks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
                "User-Agent": userAgent,
                "Authorization": authorization
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
        return {
            isOk: false,
            body: {message: 'Error fetching similar posts'}
        }
    }
}