import React from "react";
import StripePayouts from "#screens/commerce/stripe/payouts/StripePayouts";
import { useQuery } from "@tanstack/react-query";
import { getAccountID } from "#services/commerce/stripe/getAccountID";
import PayoutSkeleton from "#components/skeleton/PayoutSkeleton";
import { useAppStore } from "#store/app/appStore";

export default function StripePayoutsTab() {
  const { userSession } = useAppStore();
  const galleryId = userSession?.id;

  const { data: account, isLoading: isInitializing } = useQuery({
    queryKey: ["gallery_account_id", galleryId],
    queryFn: async () => {
      if (!galleryId)
        return { connected_account_id: null, gallery_verified: false };

      const res = await getAccountID(galleryId);
      return {
        connected_account_id: res?.data?.connected_account_id ?? null,
        gallery_verified: res?.data?.gallery_verified ?? false,
      };
    },
    enabled: Boolean(galleryId),
    staleTime: 5 * 60 * 1000,
  });

  if (isInitializing) {
    return <PayoutSkeleton />;
  }

  return (
    <StripePayouts
      showScreen={
        account?.connected_account_id !== null &&
        account?.gallery_verified === true
      }
      account_id={account?.connected_account_id || ""}
    />
  );
}
