import { shouldReplacePendingResult } from "#lib/deeplink/deepLinkResultPriority";

let pendingResult: DeepLinkResolveResult | null = null;
let pendingPayload: DeepLinkPayload | null = null;
let resolveGeneration = 0;

const flushListeners = new Set<() => void>();

export const notifyDeepLinkFlushListeners = () => {
  flushListeners.forEach((listener) => listener());
};

export const addDeepLinkFlushListener = (listener: () => void) => {
  flushListeners.add(listener);
  return () => flushListeners.delete(listener);
};

export const beginDeepLinkResolve = (): number => {
  resolveGeneration += 1;
  return resolveGeneration;
};

export const isStaleDeepLinkResolve = (generation: number) =>
  generation !== resolveGeneration;

export const stashPayloadForPostLogin = (payload: DeepLinkPayload) => {
  pendingPayload = payload;
  notifyDeepLinkFlushListeners();
};

export const queuePendingDeepLink = (
  result: DeepLinkResolveResult,
  payload?: DeepLinkPayload,
) => {
  if (shouldReplacePendingResult(pendingResult, result)) {
    pendingResult = result;
  }
  if (payload) pendingPayload = payload;
  notifyDeepLinkFlushListeners();
};

export const clearPendingDeepLinks = () => {
  pendingResult = null;
  pendingPayload = null;
};

export const hasPendingDeepLinks = () =>
  Boolean(pendingResult || pendingPayload);

export const takePendingPayload = (): DeepLinkPayload | null => {
  const payload = pendingPayload;
  pendingPayload = null;
  return payload;
};

export const takePendingResult = (): DeepLinkResolveResult | null => {
  const result = pendingResult;
  pendingResult = null;
  return result;
};

export const clearPendingResult = () => {
  pendingResult = null;
};
