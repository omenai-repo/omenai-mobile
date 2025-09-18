import React, { memo } from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import { PaymentMethod } from '@stripe/stripe-js';
import { Ionicons } from '@expo/vector-icons';

const brandIcon: Record<
  NonNullable<PaymentMethod.Card['brand']>,
  { name: keyof typeof Ionicons.glyphMap; family?: 'Ionicons' }
> = {
  visa: { name: 'card-outline' },
  mastercard: { name: 'card-outline' },
  americanExpress: { name: 'card-outline' },
  discover: { name: 'card-outline' },
  dinersClub: { name: 'card-outline' },
  jcb: { name: 'card-outline' },
  unionPay: { name: 'card-outline' },
  unknown: { name: 'card-outline' },
};

type Props = { card: PaymentMethod.Card };

function PaymentMethodCardBase({ card }: Props) {
  const brand = card.brand ?? 'unknown';
  const icon = brandIcon[brand] ?? brandIcon.unknown;

  return (
    <View style={tw`flex-row items-start justify-between mb-4`}>
      <View style={tw`gap-4`}>
        <View>
          <Text style={tw`text-[10px] text-slate-500 uppercase mb-1`}>Card Number</Text>
          <Text style={tw`text-slate-900 font-semibold`}>
            {brand.toUpperCase()} •••• {card.last4}
          </Text>
        </View>

        <View>
          <Text style={tw`text-[10px] text-slate-500 uppercase mb-1`}>Expires</Text>
          <Text style={tw`text-slate-700`}>
            {card.exp_month}/{card.exp_year}
          </Text>
        </View>
      </View>

      <View style={tw`bg-slate-100 p-3 rounded-lg items-center justify-center`}>
        <Ionicons name={icon.name} size={28} />
      </View>
    </View>
  );
}

export const PaymentMethodCard = memo(PaymentMethodCardBase);
