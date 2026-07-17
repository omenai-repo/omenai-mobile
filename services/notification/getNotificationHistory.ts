import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function getNotificationHistory({
  access_type,
}: {
  access_type: string;
}) {
  let id = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    id = JSON.parse(userSession.value).id;
  } else {
    return;
  }
  try {
    const res = await apiRequest(
      `${apiUrl}/api/notifications/fetchNotifications?id=${id}&access_type=${access_type}`,
      {
        method: "GET",
        shouldLogout: false,
      },
    );

    const result = await res.json();

    return { isOk: res.ok, data: result.data };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "An error occurred while fetching notifications.",
      },
    };
  }
}
