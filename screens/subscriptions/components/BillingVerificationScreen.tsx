import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { verifySubscriptionCharge } from "#services/stripe/verifySubscriptionCharge";
import { verifyDiscountedSubscriptionCharge } from "#services/stripe/verifyDiscountedSubscriptionCharge";
import { screenName } from "#constants/screenNames.constants";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "#config/colors.config";
import LongWhiteButton from "#components/buttons/LongWhiteButton";
import BackScreenButton from "#components/buttons/BackScreenButton";
import PremiumStateCard from "#components/general/PremiumStateCard";

type RootStackParamList = {
  BillingVerification: {
    payment_intent?: string;
    setup_intent?: string;
    isDiscounted?: boolean;
    planId?: string;
  };
};

type ScreenRouteProp = RouteProp<RootStackParamList, "BillingVerification">;

export default function BillingVerificationScreen() {
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<any>();
  const qc = useQueryClient();

  const {
    payment_intent: paymentIntentId,
    setup_intent: setupIntentId,
    isDiscounted,
    planId,
  } = route?.params ?? {};

  const navigateToGallerySubscriptions = () => {
    navigation.navigate("Gallery", {
      screen: screenName.gallery.subscriptions,
    });
  };

  const navigateToGalleryBilling = () => {
    navigation.navigate("Gallery", {
      screen: screenName.gallery.billing,
    });
  };

  // animations (for the result card)
  const cardScale = useRef(new Animated.Value(0.96)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  const { data: verified, isLoading } = useQuery({
    queryKey: [
      "verify_subscription_payment_on_redirect",
      paymentIntentId,
      setupIntentId,
    ],
    enabled: !!paymentIntentId || !!setupIntentId,
    queryFn: async () => {
      // Discounted verification flow
      if (isDiscounted && setupIntentId && planId) {
        const response = await verifyDiscountedSubscriptionCharge(
          setupIntentId,
          planId
        );
        if (!response?.isOk) {
          return {
            isOk: false,
            message:
              response?.message ??
              (response as any)?.body?.message ??
              "Verification failed.",
          };
        }
        return { isOk: true, message: response.message };
      }

      // Regular verification flow
      if (!paymentIntentId) {
        return { isOk: false, message: "No payment intent found." };
      }
      const response = await verifySubscriptionCharge(paymentIntentId);
      if (!response?.isOk) {
        return {
          isOk: false,
          message:
            response?.message ??
            (response as any)?.body?.message ??
            "Verification failed.",
        };
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
      qc.invalidateQueries({ queryKey: ["subscription_precheck"] });
      qc.invalidateQueries({ queryKey: ["subscription"] });
    }
  }, [verified?.isOk, qc]);

  // Simple loader matching premium design
  const Loader = () => (
    <View style={tw`items-center`}>
      <View style={tw`mb-8 items-center justify-center`}>
        <View
          style={[
            tw`w-20 h-20 rounded-full items-center justify-center bg-white shadow-sm`,
            {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary_black} />
        </View>
      </View>
      <Text style={tw`text-white text-base font-bold text-center mb-4`}>
        Verifying your transaction...
      </Text>
      <Text
        style={[
          tw`text-center text-sm leading-5 mb-8`,
          { color: colors.grey50 },
        ]}
      >
        Please wait while we confirm your payment details.
      </Text>
    </View>
  );

  if (!paymentIntentId && !setupIntentId) {
    return (
      <PremiumStateCard
        icon="close-circle"
        title="Verification Failed"
        description="We couldn’t find a payment intent to verify."
        onBack={() => navigation.goBack()}
        actionButton={
          <LongWhiteButton
            value="Go back to billing page"
            onClick={navigateToGalleryBilling}
            outline={false}
            style={{
              height: 48,
              backgroundColor: colors.white,
            }}
            textStyle={{
              color: colors.primary_black,
              fontSize: 14,
              fontWeight: "bold",
            }}
            icon={
              <Ionicons
                name="arrow-back"
                size={18}
                color={colors.primary_black}
              />
            }
          />
        }
      />
    );
  }

  return (
    <View style={tw`flex-1 bg-white relative`}>
      {/* Background with subtle gradient */}
      <LinearGradient
        colors={["#ffffff", "#f8f9fa", "#e9ecef"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={tw`pt-[60px] android:pt-[80px] px-[25px] z-10`}>
        <BackScreenButton handleClick={() => navigation.goBack()} />
      </View>

      <View style={tw`flex-1 items-center justify-center px-6`}>
        <View style={tw`w-full max-w-[340px] items-center`}>
          {isLoading ? (
            <View
              style={[
                tw`w-full rounded-sm overflow-hidden`,
                {
                  backgroundColor: colors.primary_black,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  elevation: 10,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.primary_black, "#000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={tw`p-8 items-center`}
              >
                <Loader />
              </LinearGradient>
            </View>
          ) : (
            <Animated.View
              style={[
                tw`w-full rounded-sm overflow-hidden`,
                {
                  transform: [{ scale: cardScale }],
                  opacity: cardOpacity,
                  backgroundColor: colors.primary_black,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  elevation: 10,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.primary_black, "#000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={tw`p-8 items-center`}
              >
                <Result
                  success={!!verified?.isOk}
                  message={verified?.isOk ? "" : verified?.message ?? ""}
                  onPrimary={
                    verified?.isOk
                      ? navigateToGallerySubscriptions
                      : navigateToGalleryBilling
                  }
                />
              </LinearGradient>
            </Animated.View>
          )}

          <View style={tw`mt-8 flex-row items-center`}>
            <View style={tw`w-2 h-2 bg-green-500 rounded-full mr-2`} />
            <Text style={tw`text-gray-400 text-xs`}>
              Secure SSL Encrypted Transaction
            </Text>
          </View>
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
    <View style={tw`items-center w-full`}>
      {/* Icon */}
      <View style={tw`mb-8 items-center justify-center`}>
        <View
          style={[
            tw`w-20 h-20 rounded-full items-center justify-center bg-white shadow-sm`,
            {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            },
          ]}
        >
          <Ionicons
            name={success ? "checkmark-circle" : "close-circle"}
            size={40}
            color={success ? "#16a34a" : "#dc2626"}
          />
        </View>
      </View>

      {/* Title */}
      <Text style={tw`text-white text-xl font-bold text-center mb-3`}>
        {success ? "Payment Verified!" : "Verification Failed"}
      </Text>

      {/* Message */}
      <Text
        style={[
          tw`text-center text-sm leading-5 mb-8`,
          { color: colors.grey50 },
        ]}
      >
        {message ||
          (success
            ? "Payment processing successful"
            : "We couldn’t confirm the payment.")}
      </Text>

      {/* CTA */}
      <View style={tw`w-full`}>
        <LongWhiteButton
          value={success ? "View Subscription Info" : "Go back to billing page"}
          onClick={onPrimary}
          outline={false}
          style={{
            height: 48,
            backgroundColor: colors.white,
          }}
          textStyle={{
            color: colors.primary_black,
            fontSize: 14,
            fontWeight: "bold",
          }}
          icon={
            <Ionicons
              name={success ? "eye" : "arrow-back"}
              size={18}
              color={colors.primary_black}
            />
          }
        />
      </View>
    </View>
  );
}
