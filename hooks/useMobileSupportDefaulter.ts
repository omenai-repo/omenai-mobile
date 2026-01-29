import { useNavigationState } from "@react-navigation/native";
import { useMemo } from "react";
import { SupportCategory } from "../types/types";

interface SupportDefault {
  category: SupportCategory;
  referenceId: string;
}

export function useMobileSupportDefaulter(): SupportDefault {
  const currentRoute = useNavigationState((state) => {
    if (!state || typeof state.index !== "number") return null;
    const route = state.routes[state.index];
    if (route.state && typeof route.state.index === "number") {
      // Nested navigator
      return route.state.routes[route.state.index];
    }
    return route;
  });

  const defaults = useMemo((): SupportDefault => {
    if (!currentRoute) return { category: "GENERAL", referenceId: "" };
    const { name, params } = currentRoute;
    const routeParams = params as any;

    // Configuration for route matching
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

    // Find first matching config
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
