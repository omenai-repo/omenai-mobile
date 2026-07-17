import { useQuery } from "@tanstack/react-query";
import { retrieveSubscriptionData } from "#services/subscriptions/retrieveSubscriptionData";
import { formatIntlDateTime } from "#utils/utils_formatIntlDateTime";

export const gallerySubscriptionOrdersAcceptQueryKey = (galleryId: string) =>
  ["gallery", "subscription", galleryId, "orders_accept"] as const;

/** Payload shape from `retrieveSubData` (subset used for order notices). */
export type GallerySubscriptionOrderNoticeData = {
  expiry_date?: string;
  status?: string;
};

export function getGalleryOrdersSubscriptionNotice({
  isLoading,
  isError,
  isActive,
  subscriptionData,
}: {
  isLoading: boolean;
  isError: boolean;
  isActive: boolean;
  subscriptionData?: GallerySubscriptionOrderNoticeData | null;
}): string {
  if (isActive) return "";
  if (isLoading) {
    return "An active subscription is required to accept orders. Renew your plan to process this order.";
  }
  if (isError) {
    return "We couldn't verify your subscription. Renew your plan to process this order.";
  }
  const exp = subscriptionData?.expiry_date;
  if (exp) {
    try {
      const formatted = formatIntlDateTime(exp);
      return `Your subscription ended on ${formatted}. Renew to process this order.`;
    } catch {
      /* fall through */
    }
  }
  return "Your gallery subscription is inactive or has expired. Renew your plan to process this order.";
}

type Args = {
  galleryId: string | undefined;
  enabled: boolean;
};

export function useGallerySubscriptionActiveForOrders({
  galleryId,
  enabled,
}: Args) {
  const query = useQuery({
    queryKey: gallerySubscriptionOrdersAcceptQueryKey(galleryId ?? ""),
    queryFn: async () => {
      if (!galleryId) {
        throw new Error("Missing gallery id");
      }
      const res = await retrieveSubscriptionData(galleryId);
      if (!res.isOk) {
        throw new Error(res.message || "Failed to load subscription");
      }
      return res;
    },
    enabled: Boolean(enabled && galleryId),
    staleTime: 5 * 60 * 1000,
  });

  const isActive = query.data?.data?.status === "active";
  const subscriptionData = query.data?.data as
    | GallerySubscriptionOrderNoticeData
    | undefined;

  return {
    isActive,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    subscriptionData,
  };
}
