// BillingCard.tsx
import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import tw from 'twrnc';
import { PaymentMethod } from '@stripe/stripe-js';
import { PaymentMethodCard } from './PaymentMethodCard';
import { PaymentMethodWallet } from './PaymentMethodWallet';
import { PaymentMethodBank } from './PaymentMethodBank';
import { useNavigation } from '@react-navigation/native';

type Props = {
  paymentMethod: PaymentMethod;
  plan_id: string;
  plan_interval: string;
};

function BillingCardBase({ paymentMethod, plan_id, plan_interval }: Props) {
  const navigation = useNavigation<any>();
  return (
    <View style={tw`bg-white rounded-2xl border border-slate-200 overflow-hidden`}>
      <View style={tw`bg-slate-50 px-5 py-4 border-b border-slate-200`}>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-slate-900 font-semibold text-base`}>Billing Method</Text>
        </View>
      </View>

      <View style={tw`p-5`}>
        {paymentMethod.type === 'card' && paymentMethod.card && (
          <PaymentMethodCard card={paymentMethod.card} />
        )}

        {paymentMethod.type !== 'card' && paymentMethod.type !== 'us_bank_account' && (
          <PaymentMethodWallet type={paymentMethod.type} />
        )}

        {paymentMethod.type === 'us_bank_account' && paymentMethod.us_bank_account && (
          <PaymentMethodBank bank={paymentMethod.us_bank_account} />
        )}

        {/* extend with more types as needed */}

        <Pressable
          onPress={() =>
            navigation.navigate('PaymentMethodChangeScreen', {
              planId: plan_id,
              planInterval: plan_interval,
            })
          }
          style={({ pressed }) =>
            tw.style(
              `self-start mt-5 px-4 py-2 rounded-md bg-slate-900`,
              pressed ? 'opacity-80' : '',
            )
          }
        >
          <Text style={tw`text-white text-[14px] font-medium`}>Update Payment Method</Text>
        </Pressable>
      </View>
    </View>
  );
}

export const BillingCard = memo(BillingCardBase);
