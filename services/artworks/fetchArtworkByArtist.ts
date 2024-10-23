import { apiUrl } from "../../constants/apiUrl.constants";

export const fetchArtworkByArtist = async (artist:string) => {
    try {
        const response = await fetch(`${apiUrl}/api/artworks/getArtworksByArtist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({artist})
        })
        .then(async (res) => {
            const ParsedResponse = {
                isOk: res.ok,
                body: await res.json(),
            };
            return ParsedResponse;
        })
        return response
    } catch(error: any) {
        return {
            isOk: false,
            body: {message: error.message}
        }
    }

}