import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";
import { utils_getAsyncData } from "utils/utils_asyncStorage";

export async function getAccountID(email: string){

    try {
        const res = await fetch(`${apiUrl}/api/stripe/getAccountId`, {
          method: "POST",
          headers: {
            'Origin': originHeader,
            "User-Agent": userAgent,
            "Authorization": authorization
          },
          body: JSON.stringify({ email }),
        });
    
        const result = await res.json();
    
        return {
          isOk: res.ok,
          data: result.data,
        };
      } catch (error: any) {
        console.log(error);
      }

}