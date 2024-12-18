import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function getSalesHighlightData({sessionId} : {sessionId: string}){
    try {
        const response = await fetch(`${apiUrl}/api/sales/getAllSalesById`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
                "User-Agent": userAgent,
                "Authorization": authorization
            },
            body: JSON.stringify({ id: sessionId}),
        })
        .then(async (res) => {
            if(!res.ok) return undefined
            const result = await res.json();

            return result;
        })

        return response
    }catch(error){
        return {
            isOk: false,
            body: {message: 'Error fetching gallery artwork highlight'}
        }
    }
}