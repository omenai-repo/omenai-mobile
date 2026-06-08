import { resolveLoginDeepLink } from "#config/deepLinkPageRegistry";
import { extractDeepLinkToken } from "#lib/deeplink/extractDeepLinkToken";
import {
  applyOrQueueDeepLink,
  loginFallbackForPayload,
  resolveAfterVerify,
} from "#features/deeplink/deepLinkApply";
import { tryFlushWhenNavReady } from "#features/deeplink/deepLinkFlush";
import {
  addDeepLinkFlushListener,
  beginDeepLinkResolve,
  isStaleDeepLinkResolve,
} from "#features/deeplink/deepLinkPending";
import {
  verifyDeepLinkToken,
  type VerifyDeepLinkOutcome,
} from "#services/deeplink/verifyDeepLinkToken";
import { useAppStore } from "#store/app/appStore";
import { Analytics } from "#utils/analytics";
import { useEffect } from "react";
import { AppState } from "react-native";

const payloadFromOutcome = (
  outcome: VerifyDeepLinkOutcome,
): DeepLinkPayload | null => {
  if (outcome.status === "ok") return outcome.data;
  return null;
};

export const resolveDeepLinkUrl = async (
  url: string,
  prefix: string,
): Promise<string> => {
  const generation = beginDeepLinkResolve();
  const token = extractDeepLinkToken(url);
  const tokenParam = token ? `?token=${encodeURIComponent(token)}` : "";
  const toDlUrl = (t?: string) =>
    `${prefix}dl${t ? `?token=${encodeURIComponent(t)}` : ""}`;

  const trackStale = () => {
    Analytics.track("deeplink_resolve_stale", { has_token: Boolean(token) });
  };

  let outcome: VerifyDeepLinkOutcome = { status: "empty" };
  if (token) {
    Analytics.track("deeplink_verify_start", { has_token: true });
    const startedAt = Date.now();
    outcome = await verifyDeepLinkToken(token);

    if (isStaleDeepLinkResolve(generation)) {
      trackStale();
      return toDlUrl(token);
    }

    Analytics.track(
      outcome.status === "ok"
        ? "deeplink_verify_success"
        : "deeplink_verify_failed",
      {
        has_token: true,
        duration_ms: Date.now() - startedAt,
        last_status:
          outcome.status === "failed" ? outcome.lastStatus : undefined,
      },
    );
  }

  if (isStaleDeepLinkResolve(generation)) {
    trackStale();
    return toDlUrl(token);
  }

  const { isLoggedIn, userType } = useAppStore.getState();
  const session: DeepLinkSessionOptions = { isLoggedIn, userType };
  const payload = payloadFromOutcome(outcome);
  const hasToken = Boolean(token);

  if (payload && !session.isLoggedIn) {
    const page = payload.payload.page.trim().toLowerCase();
    if (page === "login") {
      applyOrQueueDeepLink(resolveLoginDeepLink(payload, session));
      return toDlUrl(token);
    }
    applyOrQueueDeepLink(loginFallbackForPayload(payload), payload);
    return toDlUrl(token);
  }

  applyOrQueueDeepLink(resolveAfterVerify(payload, hasToken, session));
  return toDlUrl(token);
};

export const useDeepLinkFlush = (
  appIsReady: boolean,
  isLoggedIn: boolean,
  userType: DeepLinkUserType,
) => {
  useEffect(() => {
    if (!appIsReady) return;

    const session: DeepLinkSessionOptions = { isLoggedIn, userType };

    const tryFlush = () => {
      tryFlushWhenNavReady(session, isLoggedIn);
    };

    const removeListener = addDeepLinkFlushListener(tryFlush);
    tryFlush();

    const appStateSub = AppState.addEventListener("change", (state) => {
      if (state === "active") tryFlush();
    });

    const navReadyTimer = setTimeout(tryFlush, 0);

    return () => {
      removeListener();
      appStateSub.remove();
      clearTimeout(navReadyTimer);
    };
  }, [appIsReady, isLoggedIn, userType]);
};
