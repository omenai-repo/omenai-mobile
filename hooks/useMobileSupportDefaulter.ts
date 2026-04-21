import { useEffect, useMemo, useState } from "react";

import { navigationRef } from "#navigation/RootNavigation";

interface SupportDefault {
  category: SupportCategory;
  referenceId: string;
}

type RouteLike = {
  name: string;
  params?: object;
  state?: { index: number; routes: RouteLike[] };
};

function getDeepestFocusedRoute(
  state: { index: number; routes: RouteLike[] } | undefined,
): RouteLike | null {
  if (!state || typeof state.index !== "number") return null;
  const route = state.routes[state.index];
  if (!route) return null;
  if (
    route.state &&
    typeof route.state.index === "number" &&
    Array.isArray(route.state.routes)
  ) {
    return getDeepestFocusedRoute(route.state);
  }
  return route;
}

function readFocusedRoute(): RouteLike | null {
  try {
    if (!navigationRef.isReady()) return null;
    return getDeepestFocusedRoute(
      navigationRef.getRootState() as {
        index: number;
        routes: RouteLike[];
      },
    );
  } catch {
    return null;
  }
}

export function useMobileSupportDefaulter(): SupportDefault {
  const [currentRoute, setCurrentRoute] = useState<RouteLike | null>(() =>
    readFocusedRoute(),
  );

  useEffect(() => {
    const sync = () => setCurrentRoute(readFocusedRoute());

    sync();

    const unsub =
      typeof navigationRef.addListener === "function"
        ? navigationRef.addListener("state", sync)
        : () => {};

    const t = setTimeout(sync, 0);
    return () => {
      clearTimeout(t);
      unsub();
    };
  }, []);

  const defaults = useMemo((): SupportDefault => {
    if (!currentRoute) return { category: "GENERAL", referenceId: "" };
    const { name, params } = currentRoute;
    const routeParams = params as any;

    const ROUTE_CONFIG = [
      {
        keywords: ["Login", "Register", "ForgotPassword", "VerifyEmail"],
        category: "AUTH",
      },
      {
        keywords: ["Order", "Orders"],
        category: "ORDER",
        getRef: (p: any) => p?.orderId || p?.id || "",
      },
      {
        keywords: ["Subscription", "Plan", "Billing"],
        category: "SUBSCRIPTION",
      },
      {
        keywords: ["Payout", "Stripe"],
        category: "PAYOUT",
      },
      {
        keywords: ["Wallet", "Withdrawal"],
        category: "WALLET",
      },
      {
        keywords: ["Upload", "EditArtwork", "Artwork"],
        category: "UPLOAD",
      },
      {
        keywords: ["Checkout", "Payment", "Purchase"],
        category: "CHECKOUT",
        getRef: (p: any) => p?.payment_intent || p?.reference || "",
      },
    ] as const;

    for (const config of ROUTE_CONFIG) {
      if (config.keywords.some((keyword) => name.includes(keyword))) {
        return {
          category: config.category as SupportCategory,
          referenceId: "getRef" in config ? config.getRef(routeParams) : "",
        };
      }
    }

    return { category: "GENERAL", referenceId: "" };
  }, [currentRoute]);

  return defaults;
}
