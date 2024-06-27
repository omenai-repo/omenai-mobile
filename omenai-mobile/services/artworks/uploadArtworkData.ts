import { getAsyncData } from "utils/asyncStorage.utils";
import { apiUrl } from "../../constants/apiUrl.constants";

export async function uploadArtworkData(data: Omit<ArtworkSchemaTypes, "art_id">){

    try {
        const response = await fetch(`${apiUrl}/api/artworks/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
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
            body: {message: 'Error uploading artwork'}
        }
    }
}