import {
  fallbackOverviewTarget,
  resolveDeepLinkTarget,
  resolveLoginDeepLink,
  sessionAppRole,
  toAppRole,
} from "#config/deepLinkPageRegistry";
import { screenName } from "#constants/screenNames.constants";
import { navigate, navigationRef } from "#navigation/RootNavigation";
import { verifyDeepLinkToken } from "#services/deeplink/verifyDeepLinkToken";
import * as Linking from "expo-linking";
import { useEffect } from "react";

let pendingResult: DeepLinkResolveResult | null = null;
let pendingPayload: DeepLinkPayload | null = null;

const resolveAfterVerify = (
  payload: DeepLinkPayload | null,
  hasToken: boolean,
  options: DeepLinkSessionOptions,
): DeepLinkResolveResult => {
  if (!payload) {
    return hasToken
      ? { type: "fallback", reason: "overview", appRole: sessionAppRole(options) }
      : { type: "fallback", reason: "login", accountType: "individual" };
  }

  if (!options.isLoggedIn) {
    const page = payload.payload.page.trim().toLowerCase();
    if (page === "login") {
      return resolveLoginDeepLink(payload, options);
    }
    return {
      type: "fallback",
      reason: "login",
      accountType: toAppRole(payload.role),
    };
  }

  const result = resolveDeepLinkTarget(payload, options);
  if (result.type === "fallback") {
    return { type: "fallback", reason: "overview", appRole: sessionAppRole(options) };
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
    pendingResult = result;
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
    return navigateToTarget(
      fallbackOverviewTarget(result.appRole ?? sessionAppRole(options)),
    );
  }

  return navigateToTarget(result);
};

const applyOrQueue = (result: DeepLinkResolveResult, options: DeepLinkSessionOptions) => {
  if (navigationRef.isReady()) {
    applyDeepLinkResult(result, options);
    return;
  }
  pendingResult = result;
};

export const flushPendingDeepLinks = (options: DeepLinkSessionOptions): boolean => {
  let handled = false;

  if (pendingPayload && options.isLoggedIn) {
    const payload = pendingPayload;
    pendingPayload = null;
    handled = applyDeepLinkResult(resolveDeepLinkTarget(payload, options), options) || handled;
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
  options: DeepLinkSessionOptions,
): Promise<string> => {
  const rawToken = Linking.parse(url).queryParams?.token;
  const token = typeof rawToken === "string" ? rawToken.trim() : "";
  const toDlUrl = (t?: string) =>
    `${prefix}dl${t ? `?token=${encodeURIComponent(t)}` : ""}`;

  const payload = token ? await verifyDeepLinkToken(token) : null;

  if (payload && !options.isLoggedIn) {
    const page = payload.payload.page.trim().toLowerCase();
    if (page === "login") {
      applyOrQueue(resolveLoginDeepLink(payload, options), options);
      return toDlUrl(token);
    }
    pendingPayload = payload;
    return toDlUrl(token);
  }

  applyOrQueue(resolveAfterVerify(payload, !!token, options), options);
  return toDlUrl(token);
};

export const useDeepLinkFlush = (
  appIsReady: boolean,
  isLoggedIn: boolean,
  userType: DeepLinkUserType,
) => {
  useEffect(() => {
    if (!appIsReady || (!pendingResult && !pendingPayload)) return;

    const session: DeepLinkSessionOptions = { isLoggedIn, userType };

    const tryFlush = () => {
      if (!navigationRef.isReady()) return false;
      if (!isLoggedIn && !pendingResult) return false;
      flushPendingDeepLinks(session);
      return true;
    };

    if (tryFlush()) return;

    const interval = setInterval(() => {
      if (tryFlush()) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [appIsReady, isLoggedIn, userType]);
};
