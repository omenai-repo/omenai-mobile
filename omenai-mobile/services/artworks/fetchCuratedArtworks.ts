import filterArtObjectsByMedium from "utils/utils_filterArtObjectsByMedium";
import { apiUrl } from "../../constants/apiUrl.constants";
import { utils_getAsyncData } from "utils/utils_asyncStorage";

export async function fetchCuratedArtworks({page}:{page: number}){

    let preferences = [];
    const userSession = await utils_getAsyncData('userSession')
    if(userSession.value){
        preferences = JSON.parse(userSession.value).preferences
    }
    
    let url = apiUrl + '/api/artworks/getAllArtworks'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ page }),
        })
        .then(async (res) => {
            const result = await res.json();
            const curated = filterArtObjectsByMedium(
                result.data,
                preferences
            );
            const parsedResponse = {
                isOk: res.ok,
                body: curated,
            };
            return parsedResponse;
        })

        return response
    }catch(error){
        return {
            isOk: false,
            body: {message: 'Error fetching arteorks'}
        }
    }
}