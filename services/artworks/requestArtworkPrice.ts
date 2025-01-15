import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function requestArtworkPrice(
    data: Pick<
    ArtworkSchemaTypes,
    "title" | "artist" | "art_id" | "pricing" | "url" | "medium"
  >,
  email: string,
  name: string
){

    let url = apiUrl + '/api/requests/pricing/requestPrice'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
                "User-Agent": userAgent,
                "Authorization": authorization
            },
            body: JSON.stringify({ data, email, name }),
        })
       
            const result = await response.json();
            return { isOk: response.ok, message: result.message, data: result.data};
        

    }catch(error){
        console.log('error' + error)
        return {
            isOk: false,
            body: {message: 'Error requesting price quote for artwork'}
        }
    }
}