// import { StyleSheet, View } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import WithModal from 'components/modal/WithModal';
// import BackHeaderTitle from 'components/header/BackHeaderTitle';
// import CheckoutSummary from './components/CheckoutSummary';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { getSinglePlanData } from 'services/subscriptions/getSinglePlanData';
// import Loader from 'components/general/Loader';
// import EmptyArtworks from 'components/general/EmptyArtworks';
// import { useModalStore } from 'store/modal/modalStore';
// import { subscriptionStepperStore } from 'store/subscriptionStepper/subscriptionStepperStore';
// import WebView from 'react-native-webview';
// import MigrationUpgradeCheckoutItem from './components/MigrationCheckouts/MigrationUpgradeCheckoutItem';
// import { retrieveSubscriptionData } from 'services/subscriptions/retrieveSubscriptionData';
// import { useAppStore } from 'store/app/appStore';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { screenName } from 'constants/screenNames.constants';
// import CheckoutStepper from 'components/checkoutStepper/CheckoutStepper';
// import ScrollWrapper from 'components/general/ScrollWrapper';

// export default function Checkout() {
//   const route = useRoute();
//   const navigation = useNavigation<StackNavigationProp<any>>();

//   const [loading, setLoading] = useState<boolean>(false);
//   const [reloadCount, setReloadCount] = useState(1);
//   const [verificationScreen, setVerificationScreen] = useState<boolean>(false);

//   const [plan, setPlan] = useState<SubscriptionPlanDataTypes | null>(null);
//   const [subData, setSubData] = useState<SubscriptionModelSchemaTypes | null>(null);

//   const { updateModal } = useModalStore();
//   const { webViewUrl, setWebViewUrl } = subscriptionStepperStore();
//   const { userSession } = useAppStore();

//   const [activeIndex, setActiveIndex] = useState<number>(0);

//   const { plan_id, tab, action } = route.params as {
//     plan_id: string;
//     tab: string;
//     id?: string;
//     action?: string;
//   };

//   useEffect(() => {
//     async function fetchSinglePlanDetails() {
//       setLoading(true);
//       const plan = await getSinglePlanData(plan_id);
//       const subResults = await retrieveSubscriptionData(userSession.id);
//       if (!plan?.isOk && !subResults?.isOk) {
//         //throw error
//         updateModal({
//           message: 'Something went wrong',
//           modalType: 'error',
//           showModal: true,
//         });
//       } else {
//         setPlan(plan?.data);
//         setSubData(subResults?.data);
//       }

//       setLoading(false);
//     }

//     fetchSinglePlanDetails();
//   }, [reloadCount]);

//   const handleFlutterwaveRedirect = (event: any) => {
//     if (event.canGoBack && event.navigationType === 'formsubmit') {
//       setWebViewUrl(null);
//       // setVerificationScreen(true)
//       navigation.navigate(screenName.verifyTransaction);
//       setActiveIndex(4);
//     }
//   };

//   return (
//     <WithModal>
//       {webViewUrl === null && (
//         <View style={{ flex: 1 }}>
//           <BackHeaderTitle title="Checkout" />
//           {loading && <Loader />}
//           <ScrollWrapper style={styles.mainContainer}>
//             {/* <FormsHeaderNavigation index={activeIndex} setIndex={setActiveIndex} /> */}
//             {!loading && plan !== null && (
//               <View>
//                 {action ? (
//                   <MigrationUpgradeCheckoutItem plan={plan} interval={tab} sub_data={subData} />
//                 ) : (
//                   <View>
//                     <CheckoutStepper
//                       plan={plan}
//                       activeIndex={activeIndex}
//                       setActiveIndex={setActiveIndex}
//                       setVerificationScreen={() =>
//                         navigation.navigate(screenName.verifyTransaction)
//                       }
//                       updateCard={false}
//                     />
//                     <CheckoutSummary name={plan.name} pricing={plan.pricing} interval={tab} />
//                   </View>
//                 )}
//               </View>
//             )}
//             {!loading && plan === null && (
//               <EmptyArtworks size={70} writeUp="An unexpected error occured, reload page" />
//             )}
//           </ScrollWrapper>
//         </View>
//       )}
//       {webViewUrl && (
//         <WebView
//           source={{ uri: webViewUrl }}
//           style={{ flex: 1 }}
//           onNavigationStateChange={handleFlutterwaveRedirect}
//         />
//       )}
//     </WithModal>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainer: {
//     paddingHorizontal: 20,
//     flex: 1,
//     paddingTop: 10,
//     marginTop: 20,
//   },
// });

import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { differenceInCalendarDays } from 'date-fns';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { PaymentMethod } from '@stripe/stripe-js';
import { BillingCard } from 'screens/subscriptions/components/BillingCard';
import { createStripeTokenizedCharge } from 'services/stripe/createStripeTokenizedCharge';
import { useAppStore } from 'store/app/appStore';
import { updateSubscriptionPlan } from 'services/stripe/updateSubscriptionPlan';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { useModalStore } from 'store/modal/modalStore';
import { utils_getCurrencySymbol } from 'utils/utils_getCurrencySymbol';
import { utils_determinePlanChange } from 'utils/utils_determinePlanChange';
import { calculateSubscriptionPricing } from 'utils/calculateSubscriptionPricing';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { useStripe } from '@stripe/stripe-react-native';

type RootStackParamList = {
  MigrationUpgradeCheckout: {
    plan: SubscriptionPlanDataTypes & { createdAt?: string; updatedAt?: string; _id?: string };
    interval: 'yearly' | 'monthly';
    sub_data: SubscriptionModelSchemaTypes & { created?: string; updatedAt?: string };
    action: string;
  };
};

type ScreenRouteProp = RouteProp<RootStackParamList, 'MigrationUpgradeCheckout'>;

const PriceRow = ({
  label,
  value,
  currency,
  minus = false,
}: {
  label: string;
  value: number;
  currency: string | undefined;
  minus?: boolean;
}) => (
  <View style={tw`flex-row items-center justify-between`}>
    <Text style={tw`text-[12px] font-semibold text-slate-600`}>{label}</Text>
    <Text style={tw`text-[12px] font-semibold text-slate-900`}>
      {minus ? `-${utils_formatPrice(value, currency)}` : utils_formatPrice(value, currency)}
    </Text>
  </View>
);

export default function Checkout() {
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<any>();
  const { plan, interval, sub_data, action } = route.params;

  const { handleNextAction } = useStripe();

  const queryClient = useQueryClient();
  const { userSession: user } = useAppStore();

  const [payLoading, setPayLoading] = useState(false);
  const [migrateLoading, setMigrateLoading] = useState(false);

  const now = new Date();
  const startDate = new Date(sub_data.start_date);
  const expiryDate = new Date(sub_data.expiry_date);
  const currency = utils_getCurrencySymbol(plan.currency);

  const totalDays = differenceInCalendarDays(expiryDate, startDate);
  const days_used = Math.min(differenceInCalendarDays(now, startDate), totalDays);
  const days_left = Math.max(totalDays - days_used, 0);

  const { updateModal } = useModalStore();

  const { proratedPrice, upgradeCost, grandTotal } = useMemo(
    () =>
      calculateSubscriptionPricing(
        startDate,
        interval,
        sub_data.plan_details,
        plan,
        days_used,
        totalDays,
      ),
    [startDate, interval, sub_data.plan_details, plan, days_used, totalDays],
  );

  const plan_change_params = useMemo(() => {
    if (!sub_data) return { action: '', shouldCharge: false };
    return utils_determinePlanChange(
      sub_data.plan_details.type.toLowerCase(),
      sub_data.plan_details.interval.toLowerCase() as 'yearly' | 'monthly',
      interval === 'yearly' ? +plan.pricing.annual_price : +plan.pricing.monthly_price,
      interval,
      sub_data.status,
    );
  }, [sub_data, interval, plan.pricing]);

  // --- Actions (RN) ---
  const handlePayNow = async () => {
    if (!user?.id) {
      updateModal({
        message: 'Missing gallery id',
        showModal: true,
        modalType: 'error',
      });
      return;
    }

    try {
      setPayLoading(true);

      // Your backend creates/updates a PaymentIntent and returns {client_secret, status, paymentIntentId}
      const res = await createStripeTokenizedCharge(grandTotal, {
        name: user.name,
        email: user.email,
        gallery_id: user.id,
        plan_id: plan.plan_id,
        plan_interval: interval,
      });

      if (!res?.isOk) {
        updateModal({
          message: 'Unable to initiate card charge. Please contact support',
          showModal: true,
          modalType: 'error',
        });
        return;
      }

      const { client_secret, status, paymentIntentId } = res;
      if (status === 'requires_action') {
        const { error: nextActionErr, paymentIntent } = await handleNextAction(client_secret);
        if (nextActionErr) {
          updateModal({ message: nextActionErr.message, showModal: true, modalType: 'error' });
          return;
        }
      }

      updateModal({
        message: 'Processing payment...',
        showModal: true,
        modalType: 'input',
      });

      await queryClient.invalidateQueries({ queryKey: ['subscription_precheck'] });
      navigation.navigate('BillingVerification', {
        payment_intent: paymentIntentId,
      });
    } catch (e: any) {
      updateModal({
        message: e?.message,
        showModal: true,
        modalType: 'error',
      });
    } finally {
      setPayLoading(false);
    }
  };

  const handleMigrateToPlan = async () => {
    if (!user?.id) {
      updateModal({
        message: 'Missing gallery id',
        showModal: true,
        modalType: 'error',
      });
      return;
    }

    try {
      setMigrateLoading(true);

      const data = {
        value: interval === 'monthly' ? +plan.pricing.monthly_price : +plan.pricing.annual_price,
        currency: 'USD',
        type: plan.name,
        interval,
        id: plan._id as string,
      };

      const migrate = await updateSubscriptionPlan(data, action);
      console.log(data, action, 'hh');
      if (!migrate?.isOk) {
        updateModal({
          message: migrate?.message ?? '',
          showModal: true,
          modalType: 'error',
        });
      } else {
        updateModal({
          message: 'Migration successful',
          showModal: true,
          modalType: 'success',
        });
        await queryClient.invalidateQueries({ queryKey: ['subscription_precheck'] });
        navigation.goBack();
      }
    } catch (e: any) {
      updateModal({
        message: e?.message,
        showModal: true,
        modalType: 'success',
      });
    } finally {
      setMigrateLoading(false);
    }
  };

  const showCharge = plan_change_params.shouldCharge;

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle title="Checkout" />
      <ScrollView contentContainerStyle={tw`px-4 py-5`} showsVerticalScrollIndicator={false}>
        {/* Header / Banner */}
        <View style={tw`rounded-2xl bg-slate-900 p-5 mb-4`}>
          <Text style={tw`text-[10px] uppercase tracking-widest text-slate-300 mb-2`}>
            Subscription {plan_change_params.action}
          </Text>
          <Text style={tw`text-xl font-bold text-white mb-1`}>Omenai {plan.name} subscription</Text>
          <Text style={tw`text-[12px] text-slate-300`}>Billed {interval}</Text>
        </View>

        {/* Usage & Price Card */}
        <View style={tw`bg-white rounded-2xl border border-slate-100 p-5 mb-5`}>
          {/* Usage */}
          <View style={tw`flex-row items-center justify-between pb-3 border-b border-slate-100`}>
            <Text style={tw`text-[13px] font-medium text-slate-600`}>Current plan usage</Text>
            <Text style={tw`text-[13px] font-semibold text-slate-900`}>
              {days_left} day(s) left
            </Text>
          </View>

          {/* Breakdown */}
          <View style={tw`mt-3`}>
            <View style={tw`gap-2`}>
              <PriceRow label="Plan cost" value={upgradeCost} currency={currency} />
              <PriceRow
                label="Prorated cost"
                value={showCharge ? proratedPrice : 0}
                currency={currency}
                minus={showCharge}
              />
            </View>

            {/* Total */}
            <View style={tw`mt-3 pt-3 border-t border-slate-100`}>
              <View style={tw`flex-row items-center justify-between`}>
                <Text style={tw`text-[14px] font-semibold text-slate-900`}>Due today</Text>
                <Text style={tw`text-[16px] font-bold text-slate-900`}>
                  {showCharge
                    ? utils_formatPrice(grandTotal, currency)
                    : utils_formatPrice(0, currency)}
                </Text>
              </View>
            </View>

            {!showCharge && (
              <View style={tw`mt-4 p-3 rounded-md bg-amber-50 border border-amber-200`}>
                <Text style={tw`text-[12px] text-amber-800`}>
                  <Text style={tw`font-semibold`}>Note:</Text> Your plan change will take effect at
                  the end of your current billing cycle.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Payment Details */}
        <View style={tw`rounded-2xl border border-slate-200 bg-slate-50 p-5`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text style={tw`text-[14px] font-semibold text-slate-900`}>Payment Details</Text>
            <View style={tw`px-2 py-1 rounded-full bg-green-100`}>
              <Text style={tw`text-[10px] font-medium text-green-700`}>Encrypted</Text>
            </View>
          </View>

          {/* BillingCard should let user view/change default payment method */}
          <BillingCard
            paymentMethod={sub_data.paymentMethod as any as PaymentMethod}
            plan_id={plan.plan_id}
            plan_interval={interval}
          />
        </View>

        {/* CTA */}
        <TouchableOpacity
          disabled={payLoading || migrateLoading}
          onPress={showCharge ? handlePayNow : handleMigrateToPlan}
          style={tw.style(
            'mt-5 w-full py-3 rounded-md items-center justify-center',
            payLoading || migrateLoading ? 'bg-black/30' : 'bg-black',
          )}
        >
          {payLoading || migrateLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={tw`text-white text-[13px] font-medium`}>
              {showCharge ? 'Confirm Payment' : 'Migrate to this plan'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={tw`h-6`} />
      </ScrollView>
    </View>
  );
}
