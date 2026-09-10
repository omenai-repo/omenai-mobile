import {
  fallbackOverviewTarget,
  resolveDeepLinkTarget,
  resolveLoginDeepLink,
  sessionAppRole,
  toAppRole,
} from "#config/deepLinkPageRegistry";
import { deepLinkWrongAccountMessage } from "#lib/deeplink/deepLinkAccountMessage";
import {
  clearPendingResult,
  queuePendingDeepLink,
  stashPayloadForPostLogin,
  takePendingPayload,
  takePendingResult,
} from "#features/deeplink/deepLinkPending";
import { useModalStore } from "#store/account/modal/modalStore";
import { screenName } from "#constants/screenNames.constants";
import {
  resetToDeepLinkStack,
  resetToDeepLinkTab,
} from "#lib/navigation/navigateDeepLinkTarget";
import { navigate, navigationRef } from "#navigation/RootNavigation";
import { useAppStore } from "#store/app/appStore";
import { Analytics } from "#utils/core/analytics";

const VERIFY_FAILED_MESSAGE =
  "We couldn't open this link. Check your connection and try again from the email.";

const getDeepLinkSession = (): DeepLinkSessionOptions => {
  const { isLoggedIn, userType } = useAppStore.getState();
  return { isLoggedIn, userType };
};

export const loginFallbackForPayload = (
  payload: DeepLinkPayload,
): DeepLinkResolveResult => ({
  type: "fallback",
  reason: "login",
  accountType: toAppRole(payload.role),
});

export const resolveAfterVerify = (
  payload: DeepLinkPayload | null,
  hasToken: boolean,
  options: DeepLinkSessionOptions,
): DeepLinkResolveResult => {
  if (!payload) {
    if (hasToken) return { type: "fallback", reason: "verify_failed" };
    return { type: "fallback", reason: "login", accountType: "individual" };
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
    return resetToDeepLinkTab(target.roleWrapper, target.screen);
  }
  return resetToDeepLinkStack(target.roleWrapper, target.screen, target.params);
};

const showVerifyFailedModal = () => {
  useModalStore.getState().updateModal({
    message: VERIFY_FAILED_MESSAGE,
    showModal: true,
    modalType: "error",
  });
};

export const applyDeepLinkResult = (
  result: DeepLinkResolveResult,
  options?: DeepLinkSessionOptions,
): boolean => {
  const session = options ?? getDeepLinkSession();

  if (!navigationRef.isReady()) {
    queuePendingDeepLink(result);
    return false;
  }

  if (result.type === "fallback") {
    if (result.reason === "verify_failed") {
      showVerifyFailedModal();
      Analytics.track("deeplink_verify_failed_shown", {
        is_logged_in: session.isLoggedIn,
      });
      return true;
    }

    if (result.reason === "login") {
      if (session.isLoggedIn) {
        return navigateToTarget(
          fallbackOverviewTarget(sessionAppRole(session)),
        );
      }
      navigate(screenName.login, {
        account_type: result.accountType ?? "individual",
      });
      return true;
    }

    if (result.reason === "wrong_account") {
      const required = result.requiredRole ?? "individual";
      const current = result.currentRole ?? sessionAppRole(session);
      useModalStore.getState().updateModal({
        message: deepLinkWrongAccountMessage(required, current),
        showModal: true,
        modalType: "error",
      });
      return navigateToTarget(fallbackOverviewTarget(sessionAppRole(session)));
    }

    return navigateToTarget(
      fallbackOverviewTarget(result.appRole ?? sessionAppRole(session)),
    );
  }

  Analytics.track("deeplink_navigate", {
    screen: result.screen,
    kind: result.kind,
  });
  return navigateToTarget(result);
};

export const applyOrQueueDeepLink = (
  result: DeepLinkResolveResult,
  payload?: DeepLinkPayload,
) => {
  const session = getDeepLinkSession();

  if (payload && !session.isLoggedIn) {
    stashPayloadForPostLogin(payload);
  }

  if (navigationRef.isReady()) {
    applyDeepLinkResult(result, session);
    return;
  }
  queuePendingDeepLink(result, payload);
};

export const flushPendingDeepLinks = (
  options: DeepLinkSessionOptions,
): boolean => {
  let handled = false;

  const payload = takePendingPayload();
  if (payload && options.isLoggedIn) {
    clearPendingResult();
    handled =
      applyDeepLinkResult(resolveDeepLinkTarget(payload, options), options) ||
      handled;
  }

  const result = takePendingResult();
  if (result) {
    handled = applyDeepLinkResult(result, options) || handled;
  }

  return handled;
};
