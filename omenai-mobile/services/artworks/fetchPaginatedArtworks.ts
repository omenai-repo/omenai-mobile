import { apiUrl } from "../../constants/apiUrl.constants";

export async function fetchPaginatedArtworks(page: number, filters?: any) {
    try{
        const response = await fetch(`${apiUrl}/api/artworks/getPaginatedArtworks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ page, filters })
        })
        .then(async (res) => {
            const result = await res.json();

            return {
                isOk: res.ok,
                message: result.message,
                data: result.data,
                page: result.page,
                count: result.pageCount,
            };
        })

        return response
    }catch(error: any){
        console.log(error)
        return {
            isOk: false,
            body: {message: 'Error loading artworks'}
        }
    }
}