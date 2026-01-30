import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function updateNotification({
  read,
  readAt,
  access_type,
  notification_id,
}: {
  read: boolean;
  readAt: Date;
  access_type: string;
  notification_id: string;
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
      `${apiUrl}/api/notifications/updateNotifications`,
      {
        method: "PATCH",
        body: JSON.stringify({
          read,
          readAt,
          access_type,
          notification_id,
          userId: id,
        }),
      },
    );

    const result = await res.json();

    return { isOk: res.ok, data: result.data };
  } catch (error: any) {
    console.log(error);
    return {
      isOk: false,
      error:
        error.message || "An error occurred while updating the notification.",
    };
  }
}
