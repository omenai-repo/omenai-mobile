import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { apiUrl } from "../../constants/apiUrl.constants";

export async function fetchAllArtworksById(){

    let userId = ''
    const userSession = await utils_getAsyncData('userSession')
    if(userSession.value){
        userId = JSON.parse(userSession.value).id
    }else{
        return
    }

    try {
        const response = await fetch(`${apiUrl}/api/artworks/getAllArtworksbyId`, {
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