import filterArtObjectsByMedium from "utils/filterArtObjectsByMedium";
import { apiUrl } from "../../constants/apiUrl.constants";
import { getAsyncData } from "utils/asyncStorage.utils";

export async function fetchCuratedArtworks(){

    let preferences = [];
    const userSession = await getAsyncData('userSession')
    if(userSession.value){
        preferences = JSON.parse(userSession.value).preferences
    }
    
    let url = apiUrl + '/api/artworks/getAllArtworks'

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
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