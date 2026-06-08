import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: string, params?: Record<string, unknown>) {
  if (!navigationRef.isReady()) return;

  if (params !== undefined) {
    navigationRef.navigate({
      name,
      params,
      merge: true,
    });
    return;
  }

  const state = navigationRef.getRootState();
  const current = state?.routes[state.index]?.name;
  if (current === name) return;

  navigationRef.navigate(name);
}
