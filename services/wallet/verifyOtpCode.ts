import { apiUrl } from "#constants/apiUrl.constants";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiRequest } from "../../utils/apiRequest";

export async function verifyOtpCode(otp_pin: string) {
  let id = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    id = JSON.parse(userSession.value).id;
  }
  if (id.length < 1) return;

  try {
    const res = await apiRequest(
      `${apiUrl}/api/wallet/pin_recovery/verify_otp_code`,
      {
        method: "POST",
        body: JSON.stringify({ artist_id: id, otp: otp_pin }),
      },
    );

    const result = await res.json();

    return { isOk: res.ok, data: result };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Invalid OTP",
      },
    };
  }
}
