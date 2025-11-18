import {
  apiUrl,
  authorization,
  originHeader,
  userAgent,
} from "../../constants/apiUrl.constants";

export async function fetchsingleArtwork(art_id: string) {
  try {
    const response = await fetch(`${apiUrl}/api/artworks/getSingleArtwork`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ art_id }),
    }).then(async (res) => {
      const ParsedResponse = {
        isOk: res.ok,
        body: await res.json(),
      };

      console.log("Fetched artwork details:", ParsedResponse);
      return ParsedResponse;
    });

    return response;
  } catch {
    return {
      isOk: false,
      body: { message: "Error fetching artwork details" },
    };
  }
}
