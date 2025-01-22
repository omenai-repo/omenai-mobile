import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function fetchArtworksByCriteria({
    medium,
    filters,
    page,
}: {
    medium: string,
    filters: any,
    page: number
}){

    try {
        const response = await fetch(`${apiUrl}/api/artworks/getArtworksByCriteria`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
                "User-Agent": userAgent,
                "Authorization": authorization
            },
            body: JSON.stringify({ page, medium, filters }),
        })
       
            const result = await response.json();

            return { isOk: response.ok, data: result.data};
      
    }catch(error){
        return {
            isOk: false,
            body: {message: 'Error fetching similar posts'}
        }
    }
}