import { apiUrl } from "../../constants/apiUrl.constants";

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
            },
            body: JSON.stringify({ page, medium, filters }),
        })
        .then(async (res) => {
            const result = await res.json();

            return { isOk: res.ok, data: result.data};
        })

        return response
    }catch(error){
        return {
            isOk: false,
            body: {message: 'Error fetching similar posts'}
        }
    }
}