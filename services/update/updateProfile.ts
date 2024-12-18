import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function updateProfile(
    route: RouteIdentifier,
    payload: GalleryProfileUpdateData | IndividualProfileUpdateData,
    id: string
) {
  try {
    const response = await fetch(`${apiUrl}/api/update/${route}/profile`, {
        method: 'POST',
        body: JSON.stringify({ ...payload, id }),
        headers: {
            'Content-Type': 'application/json',
            'Origin': originHeader,
            "User-Agent": userAgent,
            "Authorization": authorization
        }
    })
    .then(async (res) => {
        const data: { message: string } = await res.json();
        const response = {
            isOk: res.ok,
            body: { message: data.message }
        };

        return response
    })

    return response
  }catch(error){
      return {
          isOk: false,
          body: {message: 'Error updating profile'}
      }
  }
}
