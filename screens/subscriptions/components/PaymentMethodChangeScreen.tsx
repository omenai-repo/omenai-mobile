import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { useStripe } from "@stripe/stripe-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "store/app/appStore";
import { createPaymentMethodSetupIntent } from "services/stripe/createPaymentMethodSetupIntent";
import { updatePaymentMethod } from "services/stripe/updatePaymentMethod";
import SuccessPaymentModal from "./SuccessPaymentModal";

export default function PaymentMethodChangeScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { planId, planInterval } = route.params;

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
    [user?.name]
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
    [displayName, initPaymentSheet, user?.email, user?.name]
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
    setPresenting(false);

    if (presentErr) {
      if (presentErr.code !== "Canceled") setError(presentErr.message);
      return;
    }

    // success -> refresh any data that depends on the PM
    const setupIntentId = clientSecret?.split("_secret_")[0] ?? null;
    await updatePaymentMethod(setupIntentId!);
    setSuccessVisible(true);
  }, [sheetReady, clientSecret, initializeSheet, presentPaymentSheet, navigation, queryClient]);

  return (
    <>
      <View style={tw`flex-1 bg-slate-50`}>
        <View style={tw`px-4 py-5 mt-[80px]`}>
          <Text style={tw`text-xl font-semibold text-slate-900`}>Change Card</Text>
        </View>

        <View style={tw`px-4`}>
          {initializing && (
            <View style={tw`my-6 items-center`}>
              <ActivityIndicator />
              <Text style={tw`mt-2 text-slate-600`}>Preparing secure form…</Text>
            </View>
          )}

          {error && !initializing && (
            <View style={tw`p-3 mb-3 rounded-lg border border-red-200 bg-red-50`}>
              <Text style={tw`text-red-700`}>{error}</Text>
            </View>
          )}

          <Pressable
            disabled={initializing || presenting || !sheetReady} // CHANGED
            onPress={handleOpenSheet}
            style={({ pressed }) =>
              tw.style(
                `mt-2 h-12 rounded-md items-center justify-center`,
                initializing || presenting || !sheetReady ? "bg-slate-300" : "bg-slate-900",
                pressed ? "opacity-85" : ""
              )
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
          // refresh + go back to billing
          queryClient.invalidateQueries({ queryKey: ["subscription_precheck"] });
          navigation.goBack();
        }}
      />
    </>
  );
}
