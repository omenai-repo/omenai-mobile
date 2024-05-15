import { apiUrl } from "../../constants/apiUrl.constants";

export async function fetchArtworkImpressions(){
    const url = apiUrl + '/api/artworks/getTrendingArtworks'

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(async (res) => {
            const ParsedResponse = {
                isOk: res.ok,
                body: await res.json(),
            };
            return ParsedResponse;
        })

        return response
    }catch(error){
        return {
            isOk: false,
            body: {message: 'Error fetching post impressions'}
        }
    }
}