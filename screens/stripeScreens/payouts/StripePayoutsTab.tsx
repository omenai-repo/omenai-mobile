import React from "react";
import StripePayouts from "#screens/stripeScreens/payouts/StripePayouts";
import { useQuery } from "@tanstack/react-query";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { getAccountID } from "#services/stripe/getAccountID";
import PayoutSkeleton from "#components/skeleton/PayoutSkeleton";

export default function StripePayoutsTab() {
  const { data: account, isLoading: isInitializing } = useQuery({
    queryKey: ["gallery_account_id"],
    queryFn: async () => {
      const userSession = await utils_getAsyncData("userSession");
      if (!userSession.value)
        return { connected_account_id: null, gallery_verified: false };

      const res = await getAccountID(JSON.parse(userSession.value).id);
      return {
        connected_account_id: res?.data?.connected_account_id ?? null,
        gallery_verified: res?.data?.gallery_verified ?? false,
      };
    },
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
