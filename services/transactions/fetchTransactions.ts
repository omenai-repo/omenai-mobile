import { apiUrl, originHeader } from "constants/apiUrl.constants";
import { utils_getAsyncData } from "utils/utils_asyncStorage";

export async function fetchTransactions() {

  let gallery_id = ''
  const userSession = await utils_getAsyncData('userSession')
  if(userSession.value){
    gallery_id = JSON.parse(userSession.value).id
  }
  if(gallery_id.length < 1) return

  try {
    const res = await fetch(`${apiUrl}/api/transactions/fetchTransaction`, {
      method: "POST",
      headers: {
        'Origin': originHeader,
      },
      body: JSON.stringify({ gallery_id }),
    });

    const result = await res.json();

    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
}
