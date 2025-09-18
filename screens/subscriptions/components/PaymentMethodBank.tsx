import React, { memo } from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import { PaymentMethod } from '@stripe/stripe-js';
import { Ionicons } from '@expo/vector-icons';

type Props = { bank: PaymentMethod.UsBankAccount };

function PaymentMethodBankBase({ bank }: Props) {
  return (
    <View style={tw`flex-row items-center justify-between`}>
      <View>
        {!!bank.bank_name && <Text style={tw`text-slate-900 font-medium`}>{bank.bank_name}</Text>}
        <Text style={tw`text-[11px] text-slate-500`}>
          {bank.account_type ?? 'account'} •••• {bank.last4}
        </Text>
      </View>
      <View style={tw`p-2 bg-slate-100 rounded-lg`}>
        <Ionicons name="business-outline" size={22} />
      </View>
    </View>
  );
}

export const PaymentMethodBank = memo(PaymentMethodBankBase);
