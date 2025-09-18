import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, Animated, Easing, Platform } from 'react-native';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onPrimaryPress: () => void;
  onRequestClose?: () => void; // Android back button
};

export default function SuccessPaymentModal({
  visible,
  title = 'Payment Method Added!',
  subtitle = 'Successfully saved to your account',
  ctaLabel = 'Back to billing',
  onPrimaryPress,
  onRequestClose,
}: Props) {
  // animations
  const scale = useRef(new Animated.Value(0)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const contentY = useRef(new Animated.Value(10)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    // check pop-in
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    }).start();

    // ripple rings
    Animated.stagger(200, [
      Animated.timing(ring1, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(ring2, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      ring1.setValue(0);
      ring2.setValue(0);
    });

    // content fade/slide
    Animated.parallel([
      Animated.timing(contentY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, scale, ring1, ring2, contentY, contentOpacity]);

  const ringStyle = (v: Animated.Value) => ({
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 2.1] }) }],
    opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0] }),
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <View style={tw`flex-1 bg-black/50 items-center justify-center px-4`}>
        {/* Card */}
        <View
          style={[tw`w-11/12 bg-white rounded-2xl overflow-hidden`, { maxWidth: 420, ...shadow() }]}
        >
          {/* Gradient header */}
          <LinearGradient
            colors={['#10B981', '#059669']} // emerald shades
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={tw`px-6 pt-8 pb-6 items-center`}
          >
            <View style={tw`w-20 h-20 items-center justify-center`}>
              {/* pulse rings */}
              <Animated.View
                style={[
                  tw`absolute w-20 h-20 rounded-full border-2 border-white/30`,
                  ringStyle(ring1),
                ]}
              />
              <Animated.View
                style={[
                  tw`absolute w-20 h-20 rounded-full border-2 border-white/20`,
                  ringStyle(ring2),
                ]}
              />
              {/* check icon */}
              <Animated.View
                style={{
                  transform: [{ scale }],
                }}
              >
                <View style={tw`w-20 h-20 rounded-full bg-white/20 items-center justify-center`}>
                  <Ionicons name="checkmark-circle" size={48} color="#fff" />
                </View>
              </Animated.View>
            </View>

            <Animated.View
              style={{
                transform: [{ translateY: contentY }],
                opacity: contentOpacity,
              }}
            >
              <Text style={tw`text-white text-base font-semibold mt-4 text-center`}>{title}</Text>
              <Text style={tw`text-white/90 text-xs mt-1 text-center`}>{subtitle}</Text>
            </Animated.View>
          </LinearGradient>

          {/* Body */}
          <Animated.View
            style={[
              tw`px-6 py-6`,
              { transform: [{ translateY: contentY }], opacity: contentOpacity },
            ]}
          >
            {/* small confirmation pill */}
            <View style={tw`self-center mb-4 px-3 py-1 rounded-full bg-emerald-50`}>
              <Text style={tw`text-emerald-700 text-xs font-medium`}>Active</Text>
            </View>

            {/* bullets */}
            <View style={tw`gap-3 mb-5`}>
              <Row icon="shield-checkmark" text="Secured with bank-level encryption" />
              <Row icon="flash" text="Ready for instant payments" />
              <Row icon="card" text="Available across all subscriptions" />
            </View>

            {/* CTA(s) */}
            <Pressable
              onPress={onPrimaryPress}
              style={({ pressed }) =>
                tw.style(
                  `h-12 rounded-md items-center justify-center bg-emerald-600`,
                  pressed ? 'opacity-90' : '',
                )
              }
              accessibilityRole="button"
              accessibilityLabel={ctaLabel}
            >
              <Text style={tw`text-white font-medium`}>{ctaLabel}</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

function Row({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={tw`flex-row items-center`}>
      <View style={tw`w-8 h-8 rounded-full bg-emerald-50 items-center justify-center mr-3`}>
        <Ionicons name={icon} size={16} color="#059669" />
      </View>
      <Text style={tw`text-slate-700`}>{text}</Text>
    </View>
  );
}

function shadow() {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 6 },
    default: {},
  });
}
