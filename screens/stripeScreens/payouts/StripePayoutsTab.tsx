import React from 'react';
import StripePayouts from 'screens/stripeScreens/payouts/StripePayouts';

export default function StripePayoutsTab({ route }: any) {
  const account = route?.params?.account;

  return (
    <StripePayouts
      showScreen={account?.connected_account_id !== null && account?.gallery_verified}
      account_id={account?.connected_account_id || ''}
    />
  );
}
