import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function updateArtworkImpressions(
    id: string,
    value: boolean,
    like_id: string
) {

    try {
        const response = await fetch(`${apiUrl}/api/artworks/updateArtworkImpressions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
                "User-Agent": userAgent,
                "Authorization": authorization
            },
            body: JSON.stringify({ id, value, like_id }),
        })
        .then(async (res) => {
            const result = await res.json();
            return { isOk: res.ok, message: result.message, data: result.data};
        })

        return response
    }catch(error){
        console.log('error' + error)
        return {
            isOk: false,
            body: {message: 'Error updating artwork impressions'}
        }
    }
}