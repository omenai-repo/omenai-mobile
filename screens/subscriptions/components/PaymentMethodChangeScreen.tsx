import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import * as Sentry from '@sentry/react-native';
import tw from 'twrnc';
import { useStripe } from '@stripe/stripe-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useAppStore } from 'store/app/appStore';
import { createPaymentMethodSetupIntent } from 'services/stripe/createPaymentMethodSetupIntent';
import { updatePaymentMethod } from 'services/stripe/updatePaymentMethod';
import SuccessPaymentModal from './SuccessPaymentModal';

export default function PaymentMethodChangeScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { planId, planInterval } = route.params ?? {};

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
    () => (user?.name ? `Omenai • ${user.name}` : 'Omenai'),
    [user?.name],
  );

  const fetchSetupIntent = useCallback(async () => {
    setError(null);
    setSheetReady(false);

    Sentry.addBreadcrumb({
      category: 'stripe',
      message: 'createPaymentMethodSetupIntent - start',
      level: 'info',
    });

    try {
      const intent = await createPaymentMethodSetupIntent();

      if (!intent?.isOk || !intent?.client_secret) {
        Sentry.setContext('createSetupIntent', { response: intent });
        Sentry.captureMessage(
          'createPaymentMethodSetupIntent returned non-ok or missing client_secret',
          'error',
        );

        setError('Unable to create a setup intent.');
        return null;
      }

      setClientSecret(intent.client_secret);

      Sentry.addBreadcrumb({
        category: 'stripe',
        message: 'createPaymentMethodSetupIntent - success',
        level: 'info',
      });

      return intent.client_secret;
    } catch (e: any) {
      Sentry.addBreadcrumb({
        category: 'exception',
        message: 'createPaymentMethodSetupIntent - exception',
        level: 'error',
      });
      Sentry.captureException(e);
      setError(e?.message ?? 'Failed to start payment setup.');
      return null;
    }
  }, []);

  const initializeSheet = useCallback(
    async (secret: string) => {
      setSheetReady(false);

      Sentry.addBreadcrumb({
        category: 'stripe',
        message: 'initPaymentSheet - start',
        level: 'info',
      });

      try {
        const { error: initError } = await initPaymentSheet({
          merchantDisplayName: displayName,
          setupIntentClientSecret: secret,
          style: 'automatic',
          returnURL: 'omenai://stripe-redirect', // iOS only
          defaultBillingDetails: {
            name: user?.name ?? '',
            email: user?.email ?? '',
          },
        });

        if (initError) {
          Sentry.setContext('initPaymentSheet', { error: initError, userId: user?.id });
          Sentry.captureMessage(`initPaymentSheet error: ${initError.message}`, 'error');

          console.warn('[initPaymentSheet] error:', initError);
          setError(initError.message);
          setSheetReady(false);
          return false;
        }

        Sentry.addBreadcrumb({
          category: 'stripe',
          message: 'initPaymentSheet - success',
          level: 'info',
        });

        setSheetReady(true);
        return true;
      } catch (e: any) {
        Sentry.addBreadcrumb({
          category: 'exception',
          message: 'initPaymentSheet - exception',
          level: 'error',
        });
        Sentry.setContext('initPaymentSheetCatch', { userId: user?.id });
        Sentry.captureException(e);

        setError(e?.message ?? 'Could not initialize payment sheet.');
        setSheetReady(false);
        return false;
      }
    },
    [displayName, initPaymentSheet, user?.email, user?.name, user?.id],
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
      if (!ok) setError((e) => e ?? 'Could not initialize payment sheet.');
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
        setError('Payment sheet not ready.');
        return;
      }
    }

    setPresenting(true);
    setError(null);

    Sentry.addBreadcrumb({
      category: 'stripe',
      message: 'presentPaymentSheet - start',
      level: 'info',
    });

    try {
      const { error: presentErr } = await presentPaymentSheet();
      setPresenting(false);

      if (presentErr) {
        if (presentErr.code !== 'Canceled') {
          Sentry.setContext('presentPaymentSheet', { error: presentErr, userId: user?.id });
          Sentry.captureMessage(`presentPaymentSheet error: ${presentErr.message}`, 'error');
        }
        setError(presentErr.message);
        return;
      }

      Sentry.addBreadcrumb({
        category: 'stripe',
        message: 'presentPaymentSheet - success',
        level: 'info',
      });

      // success -> refresh any data that depends on the PM
      const setupIntentId = clientSecret?.split('_secret_')[0] ?? null;

      Sentry.addBreadcrumb({
        category: 'stripe',
        message: 'updatePaymentMethod - start',
        level: 'info',
      });

      try {
        await updatePaymentMethod(setupIntentId!);
        Sentry.addBreadcrumb({
          category: 'stripe',
          message: 'updatePaymentMethod - success',
          level: 'info',
        });
      } catch (e: any) {
        Sentry.setContext('updatePaymentMethod', { setupIntentId, userId: user?.id });
        Sentry.captureException(e);
        setError('Payment updated locally but failed to persist. Please contact support.');
      }

      setSuccessVisible(true);
    } catch (e: any) {
      setPresenting(false);
      Sentry.addBreadcrumb({
        category: 'exception',
        message: 'presentPaymentSheet - exception',
        level: 'error',
      });
      Sentry.setContext('presentPaymentSheetCatch', { userId: user?.id });
      Sentry.captureException(e);
      setError(e?.message ?? 'An unexpected error occurred.');
    }
  }, [sheetReady, clientSecret, initializeSheet, presentPaymentSheet, user?.id]);

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
            disabled={initializing || presenting || !sheetReady}
            onPress={handleOpenSheet}
            style={({ pressed }) =>
              tw.style(
                `mt-2 h-12 rounded-md items-center justify-center`,
                initializing || presenting || !sheetReady ? 'bg-slate-300' : 'bg-slate-900',
                pressed ? 'opacity-85' : '',
              )
            }
          >
            <Text style={tw`text-white font-medium`}>
              {presenting ? 'Processing…' : 'Update payment method'}
            </Text>
          </Pressable>
        </View>
      </View>
      <SuccessPaymentModal
        visible={successVisible}
        onPrimaryPress={() => {
          setSuccessVisible(false);
          queryClient.invalidateQueries({ queryKey: ['subscription_precheck'] });
          navigation.goBack();
        }}
      />
    </>
  );
}
