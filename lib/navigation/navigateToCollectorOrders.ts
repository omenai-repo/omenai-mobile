import { CommonActions } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { navigationRef } from "#navigation/RootNavigation";

/** Resets the root stack to the collector Orders tab (clears payment screens). */
export function navigateToCollectorOrders(): boolean {
  if (!navigationRef.isReady()) return false;

  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: "Individual",
          state: {
            routes: [{ name: screenName.orders }],
            index: 0,
          },
        },
      ],
    }),
  );
  return true;
}
