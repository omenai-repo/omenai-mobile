import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { apiUrl } from "../../constants/apiUrl.constants";

export async function fetchTrendingArtworks({page, filters}:{page: number, filters: any[]}){

    try {
        const response = await fetch(`${apiUrl}/api/artworks/getTrendingArtworks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ page, filters}),
        })
        .then(async (res) => {
            if (!res.ok) return undefined;
            const result = await res.json();

            return result;
        })

        return response
    }catch(error){
        return {
            isOk: false,
            body: {message: 'Error fetching similar posts'}
        }
    }
}