import {
  fallbackOverviewTarget,
  resolveDeepLinkTarget,
  resolveLoginDeepLink,
  sessionAppRole,
  toAppRole,
} from "#config/deepLinkPageRegistry";
import { deepLinkWrongAccountMessage } from "#lib/deeplink/deepLinkAccountMessage";
import { useModalStore } from "#store/modal/modalStore";
import { screenName } from "#constants/screenNames.constants";
import { navigate, navigationRef } from "#navigation/RootNavigation";
import { verifyDeepLinkToken } from "#services/deeplink/verifyDeepLinkToken";
import { useAppStore } from "#store/app/appStore";
import * as Linking from "expo-linking";
import { useEffect } from "react";

const getDeepLinkSession = (): DeepLinkSessionOptions => {
  const { isLoggedIn, userType } = useAppStore.getState();
  return { isLoggedIn, userType };
};

let pendingResult: DeepLinkResolveResult | null = null;
let pendingPayload: DeepLinkPayload | null = null;

const flushListeners = new Set<() => void>();

const notifyFlushListeners = () => {
  flushListeners.forEach((listener) => listener());
};

const stashPayloadForPostLogin = (payload: DeepLinkPayload) => {
  pendingPayload = payload;
  notifyFlushListeners();
};

const queuePending = (
  result: DeepLinkResolveResult,
  payload?: DeepLinkPayload,
) => {
  pendingResult = result;
  if (payload) pendingPayload = payload;
  notifyFlushListeners();
};

export const clearPendingDeepLinks = () => {
  pendingResult = null;
  pendingPayload = null;
};

const loginFallbackForPayload = (
  payload: DeepLinkPayload,
): DeepLinkResolveResult => ({
  type: "fallback",
  reason: "login",
  accountType: toAppRole(payload.role),
});

const resolveAfterVerify = (
  payload: DeepLinkPayload | null,
  hasToken: boolean,
  options: DeepLinkSessionOptions,
): DeepLinkResolveResult => {
  if (!payload) {
    if (!options.isLoggedIn) {
      return { type: "fallback", reason: "login", accountType: "individual" };
    }
    return hasToken
      ? {
          type: "fallback",
          reason: "overview",
          appRole: sessionAppRole(options),
        }
      : { type: "fallback", reason: "login", accountType: "individual" };
  }

  if (!options.isLoggedIn) {
    const page = payload.payload.page.trim().toLowerCase();
    if (page === "login") {
      return resolveLoginDeepLink(payload, options);
    }
    return loginFallbackForPayload(payload);
  }

  const result = resolveDeepLinkTarget(payload, options);
  if (result.type === "fallback" && result.reason === "wrong_account") {
    return result;
  }
  if (result.type === "fallback") {
    return {
      type: "fallback",
      reason: "overview",
      appRole: sessionAppRole(options),
    };
  }
  return result;
};

const navigateToTarget = (target: DeepLinkNavigationTarget) => {
  if (!navigationRef.isReady()) return false;
  if (target.kind === "tab") {
    navigate(target.roleWrapper, { screen: target.screen });
  } else {
    navigate(target.screen, target.params);
  }
  return true;
};

const applyDeepLinkResult = (
  result: DeepLinkResolveResult,
  options: DeepLinkSessionOptions,
): boolean => {
  if (!navigationRef.isReady()) {
    queuePending(result);
    return false;
  }

  if (result.type === "fallback") {
    if (result.reason === "login") {
      if (options.isLoggedIn) {
        return navigateToTarget(
          fallbackOverviewTarget(sessionAppRole(options)),
        );
      }
      navigate(screenName.login, {
        account_type: result.accountType ?? "individual",
      });
      return true;
    }

    if (result.reason === "wrong_account") {
      const required = result.requiredRole ?? "individual";
      const current = result.currentRole ?? sessionAppRole(options);
      useModalStore.getState().updateModal({
        message: deepLinkWrongAccountMessage(required, current),
        showModal: true,
        modalType: "error",
      });
      return navigateToTarget(
        fallbackOverviewTarget(sessionAppRole(options)),
      );
    }

    return navigateToTarget(
      fallbackOverviewTarget(result.appRole ?? sessionAppRole(options)),
    );
  }

  return navigateToTarget(result);
};

const applyOrQueue = (
  result: DeepLinkResolveResult,
  options: DeepLinkSessionOptions,
  payload?: DeepLinkPayload,
) => {
  if (payload && !options.isLoggedIn) {
    stashPayloadForPostLogin(payload);
  }

  if (navigationRef.isReady()) {
    applyDeepLinkResult(result, options);
    return;
  }
  queuePending(result, payload);
};

export const flushPendingDeepLinks = (
  options: DeepLinkSessionOptions,
): boolean => {
  let handled = false;

  if (pendingPayload && options.isLoggedIn) {
    const payload = pendingPayload;
    pendingPayload = null;
    // Login fallback may have been queued before session restored on cold start.
    pendingResult = null;
    handled =
      applyDeepLinkResult(resolveDeepLinkTarget(payload, options), options) ||
      handled;
  }

  if (pendingResult) {
    const result = pendingResult;
    pendingResult = null;
    handled = applyDeepLinkResult(result, options) || handled;
  }

  return handled;
};

export const resolveDeepLinkUrl = async (
  url: string,
  prefix: string,
): Promise<string> => {
  const session = getDeepLinkSession();
  const rawToken = Linking.parse(url).queryParams?.token;
  const token = typeof rawToken === "string" ? rawToken.trim() : "";
  const toDlUrl = (t?: string) =>
    `${prefix}dl${t ? `?token=${encodeURIComponent(t)}` : ""}`;

  const payload = token ? await verifyDeepLinkToken(token) : null;

  if (payload && !session.isLoggedIn) {
    const page = payload.payload.page.trim().toLowerCase();
    if (page === "login") {
      applyOrQueue(resolveLoginDeepLink(payload, session), session);
      return toDlUrl(token);
    }
    applyOrQueue(loginFallbackForPayload(payload), session, payload);
    return toDlUrl(token);
  }

  applyOrQueue(resolveAfterVerify(payload, !!token, session), session);
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
      if (!pendingResult && !pendingPayload) return true;
      if (!navigationRef.isReady()) return false;
      if (!isLoggedIn) return false;
      flushPendingDeepLinks(session);
      return !pendingResult && !pendingPayload;
    };

    const onPending = () => {
      tryFlush();
    };

    flushListeners.add(onPending);
    tryFlush();

    const interval = setInterval(() => {
      if (tryFlush()) clearInterval(interval);
    }, 100);

    return () => {
      flushListeners.delete(onPending);
      clearInterval(interval);
    };
  }, [appIsReady, isLoggedIn, userType]);
};
