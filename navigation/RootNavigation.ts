import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
  if (!navigationRef.isReady()) return;
  const state = navigationRef.getRootState();
  const current = state?.routes[state.index]?.name;
  if (current === name) return;
  navigationRef.navigate(name as never, params as never);
}
