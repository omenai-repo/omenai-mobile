import { flushPendingDeepLinks } from "#features/deeplink/deepLinkApply";
import {
  hasPendingDeepLinks,
  notifyDeepLinkFlushListeners,
} from "#features/deeplink/deepLinkPending";
import { navigationRef } from "#navigation/RootNavigation";

export const tryFlushWhenNavReady = (
  options: DeepLinkSessionOptions,
  isLoggedIn: boolean,
) => {
  if (!hasPendingDeepLinks()) return;
  if (!navigationRef.isReady()) return;
  if (!isLoggedIn) return;
  flushPendingDeepLinks(options);
  notifyDeepLinkFlushListeners();
};
