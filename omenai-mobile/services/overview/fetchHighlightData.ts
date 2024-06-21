import { getAsyncData } from "utils/asyncStorage.utils";
import { getArtworkHighlightData } from "./getArtworkHighlightData";
import { getSalesHighlightData } from "./getSalesHighlightData";


export async function fetchHighlightData(tag: string) {

  let sessionId = '';

  const userSession = await getAsyncData('userSession')
  if(userSession.value){
    sessionId = JSON.parse(userSession.value).id
  }else{
    return
  }

  if (tag === "artworks") {
    const result = await getArtworkHighlightData({sessionId: sessionId});
    if(result)return result.data.length;
  }

  if (tag === "sales") {
    const result = await getSalesHighlightData({sessionId: sessionId});
    if(result)return result.data.length;
  }
}