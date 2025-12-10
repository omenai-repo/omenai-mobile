import { useSafeAreaInsets } from "react-native-safe-area-context";

// Returns safe area aware spacing values for profile screens (accounts for Android navigation bar and iOS notches)
export const useSafeBottomSpacing = () => {
  const insets = useSafeAreaInsets();

  return {
    // Safe padding for content container bottoms (use for containers with menu items)
    contentBottomPadding: insets.bottom + 20,

    // Safe margin for logout button containers (use for the final element before scroll end)
    buttonBottomMargin: insets.bottom + 40,
  };
};
