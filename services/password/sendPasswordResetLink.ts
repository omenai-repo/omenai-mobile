import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function sendPasswordResetLink(
    payload: {email: string},
    route: RouteIdentifier
){

    const url = apiUrl + '/api/auth/' + route + '/sendPasswordResetLink'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': originHeader,
                "User-Agent": userAgent,
                "Authorization": authorization
            },
            body: JSON.stringify({ recoveryEmail: payload.email })
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
            body: {message: 'Error logging into account'}
        }
    }
};