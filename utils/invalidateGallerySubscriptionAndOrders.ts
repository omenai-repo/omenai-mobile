import type { QueryClient } from "@tanstack/react-query";
import { gallerySubscriptionOrdersAcceptQueryKey } from "#hooks/useGallerySubscriptionActiveForOrders";

/** Matches [`GalleryOrdersListing`](omenai-mobile/screens/galleryOrders/GalleryOrdersListing.tsx). */
const GALLERY_ORDERS_QK = ["orders", "gallery"] as const;

/**
 * After gallery subscription data changes (purchase, verify, cancel, migrate, payment method),
 * refetch the order-accept subscription gate and gallery orders so UI cannot stay stale.
 */
export async function invalidateGallerySubscriptionAndOrders(
  queryClient: QueryClient,
  galleryId: string | undefined,
): Promise<void> {
  if (!galleryId) return;

  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: [...gallerySubscriptionOrdersAcceptQueryKey(galleryId)],
    }),
    queryClient.invalidateQueries({ queryKey: [...GALLERY_ORDERS_QK] }),
    queryClient.invalidateQueries({ queryKey: ["orders", galleryId] }),
  ]);
}
