import React from "react";
import {
  StyleSheet,
  ViewStyle,
  StyleProp,
  Animated,
  ScrollView,
} from "react-native";

export type ScrollWrapperRef = ScrollView;

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
  contentInsetAdjustmentBehavior?:
    | "automatic"
    | "scrollableAxes"
    | "never"
    | "always";
  bounces?: boolean;
  alwaysBounceVertical?: boolean;
  overScrollMode?: "auto" | "always" | "never";
}

const ScrollWrapper = React.forwardRef<ScrollView, ScrollWrapperProps>(
  (
    {
      children,
      style,
      contentContainerStyle,
      showsVerticalScrollIndicator = false,
      showsHorizontalScrollIndicator = false,
      onScroll,
      onEndReached,
      refreshControl,
      horizontal = false,
      nestedScrollEnabled,
      keyboardShouldPersistTaps,
      contentInsetAdjustmentBehavior,
      bounces = true,
      alwaysBounceVertical,
      overScrollMode,
    },
    ref,
  ) => {
    return (
      <Animated.ScrollView
        ref={ref}
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
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
        onScrollEndDrag={onEndReached}
        bounces={bounces}
        alwaysBounceVertical={alwaysBounceVertical}
        overScrollMode={overScrollMode}
      >
        {children}
      </Animated.ScrollView>
    );
  },
);

ScrollWrapper.displayName = "ScrollWrapper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScrollWrapper;
