import React, { useEffect, useRef, memo } from 'react';
import { Animated, View } from 'react-native';
import type { VerticalStickProps } from '../../types/otp';

const VerticalStick: React.FC<VerticalStickProps> = memo(
  ({ focusColor, style, focusStickBlinkingDuration = 350 }) => {
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0,
            useNativeDriver: true,
            duration: focusStickBlinkingDuration,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            useNativeDriver: true,
            duration: focusStickBlinkingDuration,
          }),
        ]),
        { iterations: -1 }
      ).start();
    }, [opacityAnim, focusStickBlinkingDuration]);

    return (
      <Animated.View style={{ opacity: opacityAnim }}>
        <View
          style={[
            {
              width: 2,
              height: 30,
              backgroundColor: focusColor || 'green',
            },
            style,
          ]}
          testID="otp-input-stick"
        />
      </Animated.View>
    );
  }
);

VerticalStick.displayName = 'VerticalStick';

export default VerticalStick;
