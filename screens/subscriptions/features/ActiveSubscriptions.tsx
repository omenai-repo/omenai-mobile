import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CardDetails from '../components/CardDetails';
import PlanDetails from '../components/PlanDetails';
import ManageSubscriptionsSection from '../components/ManageSubscriptionsSection';
import { useAppStore } from 'store/app/appStore';
import { retrieveSubscriptionData } from 'services/subscriptions/retrieveSubscriptionData';
import ActiveSubLoader from '../components/ActiveSubLoader';
import { useModalStore } from 'store/modal/modalStore';
import UpcomingBilling from '../components/UpcomingBilling';
import BillingInfo from '../components/BillingInfo';
import TransactionsListing from '../components/TransactionsListing';
import { useIsFocused } from '@react-navigation/native';

export default function ActiveSubscriptions({ subscriptionData }: { subscriptionData: any }) {
  if (subscriptionData)
    return (
      <View style={{ gap: 20, marginBottom: 100 }}>
        <CardDetails cardData={subscriptionData.card} />
        <PlanDetails
          sub_status={subscriptionData.status}
          plan_details={subscriptionData.plan_details}
          end_date={subscriptionData.expiry_date}
          payment={subscriptionData.payment}
        />
        <UpcomingBilling
          plan_details={subscriptionData.plan_details}
          end_date={subscriptionData.expiry_date}
          payment={subscriptionData.payment}
          next_charge_params={subscriptionData.next_charge_params}
          sub_status={subscriptionData.status}
        />
        <BillingInfo />
        <TransactionsListing />
      </View>
    );
}

const styles = StyleSheet.create({});
