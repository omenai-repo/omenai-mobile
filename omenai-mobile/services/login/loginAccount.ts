import { apiUrl } from "@/constants/apiUrl.constants";


export async function loginAccount(
    payload: IndividualLoginData,
    route: "individual"
){

    const url = apiUrl + '/api/auth/' + route + '/login'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            body: {message: 'Error logging into account'}
        }
    }
}