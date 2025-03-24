import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";


export async function artistOnboarding(payload: ArtistCategorizationUpdateDataTypes){
    try {
        const response = await fetch(`${apiUrl}/api/auth/artist/onboarding/createCategorization`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
                "User-Agent": userAgent,
                "Authorization": authorization
            },
            body: JSON.stringify(payload)
        })
        
            const ParsedResponse = {
                isOk: response.ok,
                body: await response.json(),
            };
     

        return ParsedResponse
    }catch(error){
        return {
            isOk: false,
            body: {message: 'Error onboarding artist'}
        }
    }
}