import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

type GetAccountIDResponse = {
  isOk: boolean;
  data?: Pick<
    AccountGallerySchemaTypes,
    "connected_account_id" | "gallery_verified" | "subscription_status"
  >;
  body?: {
    message: string;
  };
};

export async function getAccountID(galleryId: string): Promise<GetAccountIDResponse> {
  try {
    const res = await apiRequest(`${apiUrl}/api/stripe/getAccountId`, {
      method: "POST",
      body: JSON.stringify({ gallery_id: galleryId }),
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      data: result.data,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching Stripe account ID",
      },
    };
  }
}
