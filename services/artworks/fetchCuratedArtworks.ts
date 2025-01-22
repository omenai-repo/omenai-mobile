import filterArtObjectsByMedium from "utils/utils_filterArtObjectsByMedium";
import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";
import { utils_getAsyncData } from "utils/utils_asyncStorage";

export async function fetchCuratedArtworks({page, filters}:{page: number, filters?: any}){

    let preferences = [];
    const userSession = await utils_getAsyncData('userSession')
    if(userSession.value){
        preferences = JSON.parse(userSession.value).preferences
    }
    
    let url = apiUrl + '/api/artworks/getUserCuratedArtworks'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
                "User-Agent": userAgent,
                "Authorization": authorization
            },
            body: JSON.stringify({ page , preferences, filters}),
        })
        .then(async (res) => {
            const result = await res.json();

            return result;
        })

        return response
    }catch(error){
        return {
            isOk: false,
            body: {message: 'Error fetching arteorks'}
        }
    }
}