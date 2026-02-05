import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useQuery } from "@tanstack/react-query";
import tw from "twrnc";
import { createSubscriptionPaymentIntent } from "#services/stripe/createSubscriptionPaymentIntent";
import { createPaymentMethodSetupIntent } from "#services/stripe/createPaymentMethodSetupIntent";
import { useNavigation } from "@react-navigation/native";
import { colors } from "#config/colors.config";
import { useAppStore } from "#store/app/appStore";
import { useModalStore } from "#store/modal/modalStore";

interface Props {
  planId: string;
  amount: number;
  interval: string;
  discountEligible?: boolean;
}

export const InitialPaymentForm = ({
  planId,
  amount,
  interval,
  discountEligible = false,
}: Props) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const { userSession: user } = useAppStore();
  const { updateModal } = useModalStore();

  const {
    data: clientSecret,
    isLoading: isIntentLoading,
    error,
  } = useQuery({
    queryKey: [
      "create_payment_intent",
      planId,
      interval,
      amount,
      discountEligible,
    ],
    queryFn: async () => {
      if (!user) throw new Error("User not found");

      // Use SetupIntent for discounted flow (saves card without charging)
      if (discountEligible) {
        const response = await createPaymentMethodSetupIntent();
        if (!response?.isOk) {
          throw new Error(response?.message || "Failed to create setup intent");
        }
        return response.client_secret;
      }

      // Regular PaymentIntent flow
      const response = await createSubscriptionPaymentIntent(
        amount,
        user.id,
        {
          name: user.name,
          email: user.email,
          gallery_id: user.id,
          plan_id: planId,
          plan_interval: interval,
        },
        "omenaimobile://stripe-redirect",
      );

      if (!response.isOk) {
        throw new Error(response.message || "Failed to create payment intent");
      }
      return response.client_secret;
    },
    enabled: !!user,
  });

  const initializePaymentSheet = async () => {
    if (!clientSecret) return;

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: discountEligible ? undefined : clientSecret,
      setupIntentClientSecret: discountEligible ? clientSecret : undefined,
      merchantDisplayName: "Omenai",
      returnURL: "omenaimobile://stripe-redirect",
    });
    if (error) {
      console.log("Error initializing sheet", error);
    }
  };

  useEffect(() => {
    if (clientSecret) {
      initializePaymentSheet();
    }
  }, [clientSecret, discountEligible]);

  const handleSubscribe = async () => {
    if (!clientSecret) return;
    setLoading(true);

    const { error } = await presentPaymentSheet();

    if (error) {
      if (error.code === "Canceled") {
        // User canceled, do nothing
      } else {
        updateModal({
          message: error.message,
          showModal: true,
          modalType: "error",
        });
      }
      setLoading(false);
    } else {
      updateModal({
        message: "Subscription successfully activated!",
        showModal: true,
        modalType: "success",
      });
      setLoading(false);

      if (discountEligible) {
        // For setup intent, we can extract ID from secret or just pass params
        // The secret is like "seti_..._secret_..."
        const setupIntentId = clientSecret.split("_secret_")[0];
        navigation.navigate("BillingVerificationScreen", {
          setup_intent: setupIntentId,
          isDiscounted: true,
          planId,
        });
      } else {
        const paymentIntentId = clientSecret.split("_secret_")[0];
        navigation.navigate("BillingVerificationScreen", {
          payment_intent: paymentIntentId,
        });
      }
    }
  };

  if (isIntentLoading) {
    return <ActivityIndicator size="small" color={colors.black} />;
  }

  if (error) {
    return (
      <View style={tw`p-4 bg-red-50 border border-red-200 rounded-lg`}>
        <Text style={tw`text-red-600 text-center text-xs`}>
          Unable to load payment details. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`mt-4`}>
      <TouchableOpacity
        disabled={loading || !clientSecret}
        onPress={handleSubscribe}
        style={[
          tw`w-full py-3 rounded-md items-center justify-center`,
          loading || !clientSecret
            ? { backgroundColor: `${colors.black}4D` }
            : { backgroundColor: colors.black },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={tw`text-white text-[13px] font-medium`}>
            {discountEligible
              ? "Claim 2 months free"
              : `Subscribe for $${amount}`}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
