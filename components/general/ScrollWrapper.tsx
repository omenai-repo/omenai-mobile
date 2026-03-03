import React from "react";
import { StyleSheet, ViewStyle, StyleProp, Animated } from "react-native";

interface ScrollWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  onScroll?: (event: any) => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  refreshControl?: React.ReactElement<any>;
  horizontal?: boolean;
  nestedScrollEnabled?: boolean;
  keyboardShouldPersistTaps?: "always" | "handled" | "never";
}

const ScrollWrapper: React.FC<ScrollWrapperProps> = ({
  children,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  onScroll,
  onEndReached,
  onEndReachedThreshold,
  refreshControl,
  horizontal = false,
  nestedScrollEnabled,
  keyboardShouldPersistTaps,
}) => {
  return (
    <Animated.ScrollView
      style={[styles.container, style]}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      onScroll={onScroll}
      refreshControl={refreshControl}
      horizontal={horizontal}
      scrollEventThrottle={16} // For smooth scrolling
      nestedScrollEnabled={nestedScrollEnabled}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      onScrollEndDrag={onEndReached}
    >
      {children}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScrollWrapper;
