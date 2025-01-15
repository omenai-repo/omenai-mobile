import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";


export async function loginAccount(
    payload: IndividualLoginData,
    route: "individual" | "gallery"
){

    const url = apiUrl + '/api/auth/' + route + '/login'

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
        const result = await response.json()
        return {
            isOk: response.ok,
            body: result
        }
 

    }catch(error){
        return {
            isOk: false,
            body: {message: 'Error logging into account'}
        }
    }
};