import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import tw from 'twrnc';
import { PaymentMethod } from '@stripe/stripe-js';
import { BillingCard } from '../components/BillingCard';
import SubDetail from '../components/SubDetail';
import UpcomingSub from '../components/UpcomingSub';
import BillingInfo from '../components/BillingInfo';
import TransactionsListing from '../components/TransactionsListing';
import CancelSubscriptionModal from '../components/CancelSubscriptionModal';

type SubscriptionActiveThemeProps = {
  subscription_data: any & { createdAt: string; updatedAt: string };
  subscription_plan: any & { createdAt: string; updatedAt: string; plan_id: string };
};

export default function SubscriptionActiveThemeRN({
  subscription_data,
  subscription_plan,
}: SubscriptionActiveThemeProps) {
  const [open, setOpen] = useState(false);
  return (
    <ScrollView contentContainerStyle={tw`px-4 py-5`} showsVerticalScrollIndicator={false}>
      <View style={tw`w-full`}>
        {/* responsive grid substitute using stacked blocks */}
        <View style={tw`gap-4`}>
          <View style={tw`gap-3`}>
            <BillingCard
              paymentMethod={subscription_data.paymentMethod as PaymentMethod}
              plan_id={subscription_plan?.plan_id}
              plan_interval={subscription_data.plan_details.interval}
            />

            <SubDetail sub_data={subscription_data} onOpenCancelModal={() => setOpen(true)} />
          </View>

          <View style={tw`gap-3`}>
            <UpcomingSub sub_data={subscription_data} />
            <BillingInfo />
          </View>

          <CancelSubscriptionModal
            visible={open}
            onClose={() => setOpen(false)}
            subEnd={subscription_data.expiry_date}
          />
        </View>

        <View style={tw`mt-4`}>
          <TransactionsListing />
        </View>
      </View>
    </ScrollView>
  );
}
