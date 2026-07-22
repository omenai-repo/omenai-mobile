import React from "react";
import { Platform } from "react-native";
import type { NativeStackHeaderItem } from "@react-navigation/native-stack";

import {
  GalleryOverviewLogo,
  GalleryOverviewNotificationButton,
} from "#components/header/Header";

const iosBlurHeader = {
  headerTransparent: true,
  headerBlurEffect: "light" as const,
  headerStyle: { backgroundColor: "transparent" },
};

const androidSolidHeader = {
  headerTransparent: false,
  headerStyle: { backgroundColor: "#F7F7F7" },
};

/** Shared `screenOptions` for a single-screen native stack wrapping a primary tab (logo + bell, scroll under blur on iOS). */
export const primaryTabRootNavigatorScreenOptions = {
  headerShown: true as const,
  headerShadowVisible: false,
  headerTitle: "",
  contentStyle: { flex: 1, backgroundColor: "#F7F7F7" },
  ...(Platform.OS === "ios" ? iosBlurHeader : androidSolidHeader),
};

/**
 * Per-screen options: stable React keys + iOS `hidesSharedBackground` so header controls are not pill-wrapped.
 */
export function primaryTabRootScreenHeaderOptions(keyPrefix: string) {
  const logoKey = `${keyPrefix}-logo`;
  const notifyKey = `${keyPrefix}-notify`;

  if (Platform.OS === "ios") {
    return {
      unstable_headerLeftItems: (): NativeStackHeaderItem[] => [
        {
          type: "custom" as const,
          element: <GalleryOverviewLogo key={logoKey} />,
          hidesSharedBackground: true,
        },
      ],
      unstable_headerRightItems: (): NativeStackHeaderItem[] => [
        {
          type: "custom" as const,
          element: (
            <GalleryOverviewNotificationButton key={notifyKey} />
          ),
          hidesSharedBackground: true,
        },
      ],
    };
  }

  return {
    headerLeft: () => <GalleryOverviewLogo key={logoKey} />,
    headerRight: () => (
      <GalleryOverviewNotificationButton key={notifyKey} />
    ),
  };
}
