import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { useStripe } from "@stripe/stripe-react-native";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "#store/app/appStore";
import { createPaymentMethodSetupIntent } from "#services/stripe/createPaymentMethodSetupIntent";
import { updatePaymentMethod } from "#services/stripe/updatePaymentMethod";
import SuccessPaymentModal from "./SuccessPaymentModal";
import { invalidateGallerySubscriptionAndOrders } from "#utils/invalidateGallerySubscriptionAndOrders";
import BackHeaderTitle from "#components/header/BackHeaderTitle";

export default function PaymentMethodChangeScreen() {
  const navigation = useNavigation<any>();

  const queryClient = useQueryClient();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { userSession: user } = useAppStore();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [presenting, setPresenting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetReady, setSheetReady] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const displayName = useMemo(
    () => (user?.name ? `Omenai • ${user.name}` : "Omenai"),
    [user?.name],
  );

  const fetchSetupIntent = useCallback(async () => {
    setError(null);
    setSheetReady(false); // reset readiness on new fetch
    try {
      const intent = await createPaymentMethodSetupIntent();
      if (!intent?.isOk || !intent?.client_secret) {
        throw new Error("Unable to create a setup intent.");
      }
      setClientSecret(intent.client_secret);
      return intent.client_secret;
    } catch (e: any) {
      setError(e?.message ?? "Failed to start payment setup.");
      return null;
    }
  }, []); // it doesn't use user props; keep deps empty so it runs once

  const initializeSheet = useCallback(
    async (secret: string) => {
      setSheetReady(false);
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: displayName,
        setupIntentClientSecret: secret,
        // applePay: { merchantCountryCode: 'US' },
        // googlePay: { merchantCountryCode: 'US', testEnv: __DEV__ },
        style: "automatic",
        returnURL: "omenaimobile://stripe-redirect",
        defaultBillingDetails: {
          name: user?.name ?? "",
          email: user?.email ?? "",
        },
      });

      if (initError) {
        console.warn("[initPaymentSheet] error:", initError);
        setError(initError.message);
        setSheetReady(false);
        return false;
      }

      setSheetReady(true);
      return true;
    },
    [displayName, initPaymentSheet, user?.email, user?.name],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      setInitializing(true);
      const secret = await fetchSetupIntent();
      if (!mounted || !secret) {
        setInitializing(false);
        return;
      }
      const ok = await initializeSheet(secret);
      if (mounted) setInitializing(false);
      if (!ok) setError((e) => e ?? "Could not initialize payment sheet.");
    })();
    return () => {
      mounted = false;
    };
  }, [fetchSetupIntent, initializeSheet]);

  const refreshSubscriptionData = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: ["subscription_precheck"],
    });
    void invalidateGallerySubscriptionAndOrders(queryClient, user?.id);
  }, [queryClient, user?.id]);

  const handleOpenSheet = useCallback(async () => {
    // Safety: ensure ready. If not, try to initialize now.
    if (!sheetReady) {
      if (clientSecret) {
        const ok = await initializeSheet(clientSecret);
        if (!ok) return;
      } else {
        return;
      }
    }

    setPresenting(true);
    setError(null);

    const { error: presentErr } = await presentPaymentSheet();

    if (presentErr) {
      setPresenting(false);
      if (presentErr.code !== "Canceled") setError(presentErr.message);
      return;
    }

    const setupIntentId = clientSecret?.split("_secret_")[0];
    if (!setupIntentId) {
      setPresenting(false);
      setError("Invalid setup. Please contact support.");
      return;
    }

    try {
      const result = await updatePaymentMethod(setupIntentId);
      if (!result?.isOk) {
        setError(
          result?.message ??
            result?.body?.message ??
            "Failed to save payment method. Please try again.",
        );
        return;
      }
      setSuccessVisible(true);
      refreshSubscriptionData();
    } catch {
      setError("Failed to save payment method. Please try again.");
    } finally {
      setPresenting(false);
    }
  }, [
    sheetReady,
    clientSecret,
    initializeSheet,
    presentPaymentSheet,
    refreshSubscriptionData,
  ]);

  return (
    <>
      <View style={tw`flex-1 bg-slate-50`}>
        <BackHeaderTitle title="Change card" />

        <View style={tw`px-4`}>
          {initializing && (
            <View style={tw`my-6 items-center`}>
              <ActivityIndicator />
              <Text style={tw`mt-2 text-slate-600`}>
                Preparing secure form…
              </Text>
            </View>
          )}

          {error && !initializing && (
            <View
              style={tw`p-3 mb-3 rounded-sm border border-red-200 bg-red-50`}
            >
              <Text style={tw`text-red-700`}>{error}</Text>
            </View>
          )}

          <Pressable
            disabled={initializing || presenting || !sheetReady}
            onPress={handleOpenSheet}
            style={({ pressed }) =>
              tw`mt-2 h-12 rounded-sm items-center justify-center
                ${
                  initializing || presenting || !sheetReady
                    ? "bg-slate-300"
                    : "bg-slate-900"
                }
                ${pressed ? "opacity-85" : ""}`
            }
          >
            <Text style={tw`text-white font-medium`}>
              {presenting ? "Processing…" : "Update payment method"}
            </Text>
          </Pressable>
        </View>
      </View>
      <SuccessPaymentModal
        visible={successVisible}
        onPrimaryPress={() => {
          setSuccessVisible(false);
          void queryClient.invalidateQueries({
            queryKey: ["subscription_precheck"],
          });
          void invalidateGallerySubscriptionAndOrders(queryClient, user?.id);
          navigation.goBack();
        }}
      />
    </>
  );
}
