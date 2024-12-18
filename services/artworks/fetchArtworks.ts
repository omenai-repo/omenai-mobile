import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function fetchArtworks({listingType, page}: {listingType: artworkListingType, page: number}){
    
    let url = ''
    if(listingType === 'trending') url = apiUrl + '/api/artworks/getTrendingArtworks'
    if(listingType === 'recent') url = apiUrl + '/api/artworks/getAllArtworks'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
                "User-Agent": userAgent,
                "Authorization": authorization
            },
            body: JSON.stringify({ page }),
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