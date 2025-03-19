import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";


export async function registerAccount(
    payload: Omit<IndividualRegisterData,"confirmPassword">&{preferences: string[]} | GalleryRegisterData | ArtistRegisterData,
    route: "gallery" | "individual" | "artist"
){

    const url = apiUrl + '/api/auth/' + route + '/register'

    try {
        const response = await fetch(url, {
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
            body: {message: 'Error creating account'}
        }
    }
}