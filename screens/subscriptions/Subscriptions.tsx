import { StyleSheet, Text, View, Platform } from 'react-native';
import React from 'react';
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

export default function Subscriptions() {
  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();

  const { data: isConfirmed, isLoading } = useQuery({
    queryKey: ['subscription_precheck'],
    queryFn: async () => {
      try {
        // Fetch account ID first, as it's required for the next call
        const acc: any = await getAccountID(userSession.email);
        if (!acc?.isOk) {
          updateModal({
            message: 'Something went wrong, Please refresh again',
            modalType: 'error',
            showModal: true,
          });
        }

        // Start retrieving subscription data while fetching Stripe onboarding status
        const [response, sub_check]: any = await Promise.all([
          checkIsStripeOnboarded(acc.data.connected_account_id), // Dependent on account ID
          retrieveSubscriptionData(userSession.id), // Independent
        ]);

        if (!response?.isOk || !sub_check?.isOk) {
          updateModal({
            message: 'Something went wrong, Please refresh again',
            modalType: 'error',
            showModal: true,
          });
        }

        return {
          isSubmitted: response.details_submitted,
          id: acc.data.connected_account_id,
          isSubActive: sub_check?.data?.subscription_id ? true : false,
          subscription_data: sub_check.data,
          subscription_plan: sub_check.plan,
        };
      } catch (error) {
        updateModal({
          message: 'Something went wrong, Please refresh again',
          modalType: 'error',
          showModal: true,
        });
        // Return a default object to satisfy the return type
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
      <View style={styles.safeArea}>
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
    paddingHorizontal: 20,
    marginTop: 20,
    flex: 1,
  },
  safeArea: {
    paddingTop: Platform.OS === 'android' ? 50 : 80,
  },
});
