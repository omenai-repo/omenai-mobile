import { date } from "zod";
import { apiUrl } from "../../constants/apiUrl.constants";

export async function fetchsingleArtworkOnPurchase(title:string){

    try {
        const response = await fetch(`${apiUrl}/api/artworks/getSingleArtworkOnPurchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title})
        })
        .then(async (res) => {
            const result = await res.json();

            return { isOk: res.ok, message: result.message, data: result.data };
        })

        return response
    }catch(error){
        return {
            isOk: false,
            body: {message: 'Error fetching artwork details'}
        }
    }

}