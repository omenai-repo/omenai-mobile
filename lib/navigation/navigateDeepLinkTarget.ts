import { CommonActions } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { navigationRef } from "#navigation/RootNavigation";

/** Default tab when a stack deep link resets the role root (one screen above target). */
const DEFAULT_TAB_BY_WRAPPER: Record<
  DeepLinkNavigationTarget["roleWrapper"],
  string
> = {
  Individual: screenName.home,
  Artist: "Overview",
  Gallery: screenName.gallery.overview,
};

const baseTabRoute = (wrapper: DeepLinkNavigationTarget["roleWrapper"]) => ({
  name: wrapper,
  state: {
    routes: [{ name: DEFAULT_TAB_BY_WRAPPER[wrapper] }],
    index: 0,
  },
});

/** Tab deep link: reset root to a single tab (clears stacked push screens). */
export function resetToDeepLinkTab(
  wrapper: DeepLinkNavigationTarget["roleWrapper"],
  tabScreen: string,
): boolean {
  if (!navigationRef.isReady()) return false;

  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: wrapper,
          state: {
            routes: [{ name: tabScreen }],
            index: 0,
          },
        },
      ],
    }),
  );
  return true;
}

/**
 * Stack deep link: reset to [role tabs, target] so back goes to tabs once.
 * Avoids pushing Artwork → Purchase → … and the dual-screen pop glitch.
 */
export function resetToDeepLinkStack(
  wrapper: DeepLinkNavigationTarget["roleWrapper"],
  screen: string,
  params?: Record<string, unknown>,
): boolean {
  if (!navigationRef.isReady()) return false;

  navigationRef.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [
        baseTabRoute(wrapper),
        params === undefined ? { name: screen } : { name: screen, params },
      ],
    }),
  );
  return true;
}
