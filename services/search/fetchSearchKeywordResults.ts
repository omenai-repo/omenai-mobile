import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function fetchSearchKeyWordResults(searchTerm: string) {
  try {
    const response = await fetch(`${apiUrl}/api/search`, {
        method: 'POST',
        body: JSON.stringify({ searchTerm }),
        headers: {
            'Content-Type': 'application/json',
            'Origin': originHeader,
            "User-Agent": userAgent,
            "Authorization": authorization
        }
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
          body: {message: 'Error fetching search'}
      }
  }
}
