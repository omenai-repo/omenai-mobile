import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Pressable, Animated, Easing, Platform } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from 'store/app/appStore';
import { verifySubscriptionCharge } from 'services/stripe/verifySubscriptionCharge';
import { screenName } from 'constants/screenNames.constants';

type RootStackParamList = {
  BillingVerification: { payment_intent: string };
};

type ScreenRouteProp = RouteProp<RootStackParamList, 'BillingVerification'>;

export default function BillingVerificationScreen() {
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<any>();
  const qc = useQueryClient();

  const paymentIntentId = route?.params?.payment_intent;

  // animations (for the result card)
  const cardScale = useRef(new Animated.Value(0.96)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  const { data: verified, isLoading } = useQuery({
    queryKey: ['verify_subscription_payment_on_redirect', paymentIntentId],
    enabled: !!paymentIntentId,
    queryFn: async () => {
      const response = await verifySubscriptionCharge(paymentIntentId);
      if (!response?.isOk) {
        return { isOk: false, message: response?.message ?? 'Verification failed.' };
      }
      return { isOk: true, message: response.message };
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 7,
          tension: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, cardOpacity, cardScale]);

  // keep user data fresh after verification succeeds
  useEffect(() => {
    if (verified?.isOk) {
      qc.invalidateQueries({ queryKey: ['subscription_precheck'] });
      qc.invalidateQueries({ queryKey: ['subscription'] });
    }
  }, [verified?.isOk, qc]);

  // Simple loader with pulse rings
  const Loader = () => (
    <View style={tw`items-center`}>
      <View style={tw`w-16 h-16 items-center justify-center`}>
        <PulseRing delay={0} />
        <PulseRing delay={200} />
        <View
          style={tw`w-16 h-16 rounded-full border-4 border-blue-300 items-center justify-center`}
        >
          <Ionicons name="card" size={22} color="#2563eb" />
        </View>
      </View>
      <Text style={tw`mt-4 text-slate-600`}>Please wait while we confirm your payment…</Text>
      <View style={tw`mt-3`}>
        <ActivityIndicator />
      </View>
    </View>
  );

  if (!paymentIntentId) {
    return (
      <View style={tw`flex-1 bg-slate-50 items-center justify-center px-4`}>
        <Result
          success={false}
          message="We couldn’t find a payment intent to verify."
          onPrimary={() => navigation.replace(screenName.gallery.subscriptions)}
        />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      {/* Header */}
      <View style={tw`px-4 pt-10 pb-3`}>
        <Text style={tw`text-xl font-semibold text-slate-900`}>Verifying your transaction</Text>
      </View>

      <View style={tw`flex-1 items-center justify-center px-4`}>
        {isLoading ? (
          <View style={[tw`w-11/12 bg-white rounded-2xl p-6`, cardShadow()]}>
            <Loader />
          </View>
        ) : (
          <Animated.View
            style={[
              tw`w-11/12 bg-white rounded-2xl p-6`,
              { transform: [{ scale: cardScale }], opacity: cardOpacity },
              cardShadow(),
            ]}
          >
            <Result
              success={!!verified?.isOk}
              message={verified?.message ?? ''}
              onPrimary={() => navigation.replace(screenName.gallery.subscriptions)}
            />
          </Animated.View>
        )}
      </View>

      {/* Security badge */}
      <View style={tw`items-center pb-6`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`w-2 h-2 bg-green-400 rounded-full mr-2`} />
          <Text style={tw`text-slate-500 text-xs`}>Secure SSL Encrypted Transaction</Text>
        </View>
      </View>
    </View>
  );
}

function Result({
  success,
  message,
  onPrimary,
}: {
  success: boolean;
  message: string;
  onPrimary: () => void;
}) {
  return (
    <View style={tw`items-center`}>
      {/* Icon */}
      <View
        style={tw.style(
          `w-20 h-20 rounded-full items-center justify-center mb-5`,
          success ? tw`bg-green-100` : tw`bg-red-100`,
        )}
      >
        <Ionicons
          name={success ? 'checkmark-circle' : 'close-circle'}
          size={48}
          color={success ? '#16a34a' : '#dc2626'}
        />
      </View>

      {/* Title */}
      <Text
        style={tw.style(`text-lg font-semibold mb-2`, success ? 'text-green-700' : 'text-red-700')}
      >
        {success ? 'Payment Verified!' : 'Verification Failed'}
      </Text>

      {/* Message */}
      <Text style={tw`text-slate-600 text-center mb-6`}>
        {message || (success ? 'Your payment was confirmed.' : 'We couldn’t confirm the payment.')}
      </Text>

      {/* CTA */}
      <Pressable
        onPress={onPrimary}
        style={({ pressed }) =>
          tw.style(
            `h-12 rounded-md items-center justify-center w-full`,
            success ? 'bg-blue-600' : 'bg-slate-900',
            pressed ? 'opacity-90' : '',
          )
        }
        accessibilityRole="button"
        accessibilityLabel={success ? 'View Subscription Info' : 'Go Back to billing page'}
      >
        <View style={tw`flex-row items-center`}>
          <Ionicons name={success ? 'eye' : 'arrow-back'} size={18} color="#fff" style={tw`mr-2`} />
          <Text style={tw`text-white font-medium`}>
            {success ? 'View Subscription Info' : 'Go back to billing page'}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

// subtle pulse rings around the loader icon
function PulseRing({ delay = 0 }: { delay?: number }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
          delay,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
          delay,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scale, opacity, delay]);

  return (
    <Animated.View
      style={[
        tw`absolute w-16 h-16 rounded-full border-2 border-blue-400`,
        {
          opacity,
          transform: [{ scale: scale.interpolate({ inputRange: [0, 1], outputRange: [1, 2] }) }],
        },
      ]}
    />
  );
}

function cardShadow() {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 4 },
    default: {},
  });
}
