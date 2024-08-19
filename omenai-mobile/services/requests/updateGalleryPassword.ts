import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { apiUrl } from "../../constants/apiUrl.constants";

export async function updateGalleryPassword(password: string, code: string){

    let id = ''
    const userSession = await utils_getAsyncData('userSession')
    if(userSession.value){
        id = JSON.parse(userSession.value).id
    }else{
        return
    }

    try {
        const response = await fetch(`${apiUrl}/api/requests/gallery/updatePassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gallery_id: id, password, code}),
        })
        .then(async (res) => {
            const result = await res.json();

            return { isOk: res.ok, message: result.message };
        })

        return response
    }catch(error){
        return {
            isOk: false,
            message: 'Error reseting password'
        }
    }
}