import { apiUrl } from "../../constants/apiUrl.constants";


export async function verifyEmail(
    payload: { params: string; token: string },
    route: RouteIdentifier
){

    try {
        const response = await fetch(`${apiUrl}/api/requests/${route}/verifyMail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ params: payload.params, token: payload.token })
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
            body: {message: 'Error verifying token, try again later'}
        }
    }
}