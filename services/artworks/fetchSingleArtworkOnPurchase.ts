import { date } from "zod";
import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function fetchsingleArtworkOnPurchase(title:string){

    try {
        const response = await fetch(`${apiUrl}/api/artworks/getSingleArtworkOnPurchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
                "User-Agent": userAgent,
                "Authorization": authorization
            },
            body: JSON.stringify({title})
        })
        
            const result = await response.json();

            return { isOk: response.ok, message: result.message, data: result.data };
     


    }catch(error){
        return {
            isOk: false,
            body: {message: 'Error fetching artwork details'}
        }
    }

}