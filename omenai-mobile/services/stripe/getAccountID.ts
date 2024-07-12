import { apiUrl } from "../../constants/apiUrl.constants";
import { getAsyncData } from "utils/asyncStorage.utils";

export async function getAccountID(email: string){

    try {
        const res = await fetch(`${apiUrl}/api/stripe/getAccountId`, {
          method: "POST",
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