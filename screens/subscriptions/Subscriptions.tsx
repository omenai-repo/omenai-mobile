import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import * as Sentry from '@sentry/react-native';
import InActiveSubscription from './features/InActiveSubscription';
import { useAppStore } from 'store/app/appStore';
import ActiveSubscriptions from './features/ActiveSubscriptions';
import WithModal from 'components/modal/WithModal';
import ActiveSubLoader from './components/ActiveSubLoader';
import { useModalStore } from 'store/modal/modalStore';
import { retrieveSubscriptionData } from 'services/subscriptions/retrieveSubscriptionData';
import ScrollWrapper from 'components/general/ScrollWrapper';
import { getAccountID } from 'services/stripe/getAccountID';
import { checkIsStripeOnboarded } from 'services/stripe/checkIsStripeOnboarded';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Subscriptions() {
  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();
  const insets = useSafeAreaInsets();

  const { data: isConfirmed, isLoading } = useQuery({
    queryKey: ['subscription_precheck'],
    queryFn: async () => {
      try {
        Sentry.addBreadcrumb({
          category: 'network',
          message: 'getAccountID called',
          level: 'info',
        });

        const acc: any = await getAccountID(userSession.email);

        if (!acc?.isOk) {
          Sentry.setContext('getAccountID', { response: acc, email: userSession.email });
          Sentry.captureMessage('getAccountID returned non-ok response', 'error');

          updateModal({
            message: 'Something went wrong, Please refresh again',
            modalType: 'error',
            showModal: true,
          });

          return {
            isSubmitted: false,
            id: '',
            isSubActive: false,
            subscription_data: null,
            subscription_plan: null,
          };
        }

        const connectedAccountId = acc.data?.connected_account_id;

        Sentry.addBreadcrumb({
          category: 'network',
          message: 'Starting parallel requests for stripe onboarding & subscription data',
          level: 'info',
        });

        // Start retrieving subscription data while fetching Stripe onboarding status
        const [response, sub_check]: any = await Promise.all([
          checkIsStripeOnboarded(connectedAccountId), // Dependent on account ID
          retrieveSubscriptionData(userSession.id), // Independent
        ]);

        if (!response?.isOk || !sub_check?.isOk) {
          Sentry.setContext('subscriptionPrecheck', {
            stripeOnboardResponse: response,
            subscriptionResponse: sub_check,
            connectedAccountId,
            userId: userSession.id,
          });
          Sentry.captureMessage('One or more subscription precheck calls returned non-ok', 'error');

          updateModal({
            message: 'Something went wrong, Please refresh again',
            modalType: 'error',
            showModal: true,
          });

          return {
            isSubmitted: !!response?.details_submitted,
            id: connectedAccountId ?? '',
            isSubActive: !!sub_check?.data?.subscription_id,
            subscription_data: sub_check?.data ?? null,
            subscription_plan: sub_check?.plan ?? null,
          };
        }

        return {
          isSubmitted: response.details_submitted,
          id: connectedAccountId,
          isSubActive: sub_check?.data?.subscription_id ? true : false,
          subscription_data: sub_check.data,
          subscription_plan: sub_check.plan,
        };
      } catch (error: any) {
        Sentry.addBreadcrumb({
          category: 'exception',
          message: 'Unhandled error in subscription_precheck',
          level: 'error',
        });

        Sentry.setContext('subscriptionPrecheckCatch', {
          userId: userSession?.id,
          email: userSession?.email,
        });
        Sentry.captureException(error);

        updateModal({
          message: 'Something went wrong, Please refresh again',
          modalType: 'error',
          showModal: true,
        });

        return {
          isSubmitted: false,
          id: '',
          isSubActive: false,
          subscription_data: null,
          subscription_plan: null,
        };
      }
    },
    refetchOnWindowFocus: true,
  });

  return (
    <WithModal>
      <View
        style={{
          paddingTop: insets.top + 16,
        }}
      >
        <View style={styles.headerContainer}>
          <Text style={{ fontSize: 20, textAlign: 'center' }}>Subscription & Billing</Text>
        </View>
      </View>
      {isLoading ? (
        <View style={{ padding: 20 }}>
          <ActiveSubLoader />
        </View>
      ) : (
        <ScrollWrapper style={styles.mainContainer} showsVerticalScrollIndicator={false}>
          {isConfirmed?.isSubActive ? (
            <ActiveSubscriptions
              subscription_data={isConfirmed?.subscription_data}
              subscription_plan={isConfirmed?.subscription_plan}
            />
          ) : (
            <InActiveSubscription />
          )}
          <View style={{ paddingVertical: 30 }} />
        </ScrollWrapper>
      )}
    </WithModal>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
  },
  mainContainer: {
    marginTop: 20,
    flex: 1,
  },
});
