import React from 'react';
import { FlatList, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface ScrollWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  onScroll?: (event: any) => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  refreshControl?: React.ReactElement;
  horizontal?: boolean;
  nestedScrollEnabled?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'handled' | 'never';
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
  // Wrap children in a container for FlatList
  const renderItem = () => <View>{children}</View>;

  return (
    <FlatList
      data={[{ key: 'content' }]}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      style={[styles.container, style]}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      onScroll={onScroll}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshControl={refreshControl}
      horizontal={horizontal}
      scrollEventThrottle={16} // For smooth scrolling
      nestedScrollEnabled={nestedScrollEnabled}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScrollWrapper;
