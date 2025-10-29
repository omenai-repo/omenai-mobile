import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import WithModal from 'components/modal/WithModal';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { checkIsStripeOnboarded } from 'services/stripe/checkIsStripeOnboarded';
import Loader from 'components/general/Loader';
import CompleteOnBoarding from './components/CompleteOnBoarding';
import { useModalStore } from 'store/modal/modalStore';
import BlockingScreen from './components/BlockingScreen';
import PayoutDashboard from './components/PayoutDashboard';
import { colors } from 'config/colors.config';
import * as Sentry from '@sentry/react-native';

export default function StripePayouts({
  account_id,
  showScreen,
}: {
  account_id: string;
  showScreen: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [refreshCount, setRefreshCount] = useState<number>(1);

  const { updateModal } = useModalStore();

  useEffect(() => {
    async function handleOnBoardingCheck() {
      setLoading(true);
      try {
        const res = await checkIsStripeOnboarded(account_id);
        if (res?.isOk) {
          setIsSubmitted(res.details_submitted);
        } else {
          Sentry.setContext('stripeOnboard', {
            account_id,
            response: res,
          });
          Sentry.captureMessage(`Stripe onboard check failed for account ${account_id}`, 'error');

          updateModal({
            message: 'Something went wrong, please try again or contact support',
            modalType: 'error',
            showModal: true,
          });
        }
      } catch (error: any) {
        Sentry.setContext('stripeOnboardCatch', {
          account_id,
        });
        Sentry.captureException(error);
      } finally {
        setLoading(false);
      }
    }

    handleOnBoardingCheck();
  }, []);

  if (!showScreen) return <BlockingScreen />;

  if (loading)
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Loader />
      </View>
    );

  if (!loading && showScreen)
    return (
      <WithModal>
        <BackHeaderTitle title={isSubmitted ? 'Stripe Payout' : 'Complete stripe onboarding'} />
        <View style={styles.container}>
          {!isSubmitted && <CompleteOnBoarding />}
          {isSubmitted && account_id.length > 0 && (
            <PayoutDashboard account_id={account_id} refreshCount={refreshCount} />
          )}
        </View>
      </WithModal>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: 15,
    marginTop: 15,
  },
});
