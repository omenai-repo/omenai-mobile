import { getAsyncData } from "utils/asyncStorage.utils";
import { apiUrl } from "../../constants/apiUrl.constants";

export async function fetchPopularArtworks(){

    let userId = ''
    const userSession = await getAsyncData('userSession')
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