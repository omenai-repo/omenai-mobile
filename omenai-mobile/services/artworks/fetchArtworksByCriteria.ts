import { apiUrl } from "../../constants/apiUrl.constants";

export async function fetchArtworksByCriteria(medium: string){

    try {
        const response = await fetch(`${apiUrl}/api/artworks/getArtworksByCriteria`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ medium }),
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
            body: {message: 'Error fetching similar posts'}
        }
    }
}