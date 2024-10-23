import { apiUrl } from "../../constants/apiUrl.constants";

export async function fetchsingleArtwork(title:string){

    try {
        const response = await fetch(`${apiUrl}/api/artworks/getSingleArtwork`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title})
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
            body: {message: 'Error fetching artwork details'}
        }
    }

}