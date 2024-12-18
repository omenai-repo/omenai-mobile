import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";


export async function registerAccount(
    payload: IndividualRegisterData | GalleryRegisterData,
    route: "gallery" | "individual"
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
            body: {message: 'Error creating account'}
        }
    }
}