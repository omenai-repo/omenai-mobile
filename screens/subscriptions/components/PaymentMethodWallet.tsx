import React, { memo } from 'react';
import { View, Text, Image } from 'react-native';
import { SvgFromUri } from 'react-native-svg';
import { useAppStore } from 'store/app/appStore';
import tw from 'twrnc';

const paymentIcons: Record<string, string> = {
  applePay: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/applepay.svg',
  googlePay: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlepay.svg',
  amazonPay: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazonpay.svg',
  paypal: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/paypal.svg',
  cashApp: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/cashapp.svg',
  link: 'https://cdn.jsdelivr.net/npm/heroicons@2.0.0/24/outline/link.svg',
};

type PaymentIconType =
  | 'applePay'
  | 'googlePay'
  | 'amazonPay'
  | 'paypal'
  | 'link'
  | 'cashApp'
  | string;

// maps stripe-ish wallet types to our keys
const normalizeType = (type?: string): PaymentIconType => {
  if (!type) return 'link';
  const t = type.toLowerCase();
  if (t.includes('apple')) return 'applePay';
  if (t.includes('google')) return 'googlePay';
  if (t.includes('amazon')) return 'amazonPay';
  if (t.includes('paypal')) return 'paypal';
  if (t.includes('cash')) return 'cashApp';
  if (t.includes('link')) return 'link';
  return type as PaymentIconType;
};

type Props = { type: PaymentIconType | string };

function PaymentMethodWalletBase({ type }: Props) {
  const { userSession } = useAppStore();

  const t = normalizeType(type);
  const label =
    t === 'applePay'
      ? 'Apple Pay'
      : t === 'amazonPay'
      ? 'Amazon Pay'
      : t === 'cashApp'
      ? 'Cash App'
      : t === 'googlePay'
      ? 'Google Pay'
      : t === 'paypal'
      ? 'PayPal'
      : 'Wallet';

  return (
    <>
      <View style={tw`flex-row items-center justify-start`}>
        <View style={tw`flex-row items-center gap-2`}>
          {!!paymentIcons[t] && <SvgFromUri uri={paymentIcons[t]} width="28px" height="28px" />}
          <Text style={tw`text-slate-900 font-semibold text-[16px]`}>{label}</Text>
        </View>
      </View>

      <View style={tw`mt-3 mb-3 gap-[5px]`}>
        {!!userSession?.email && (
          <Text style={tw`text-[14px] text-slate-500`}>{userSession.email}</Text>
        )}
        {!!userSession?.name && (
          <Text style={tw`text-[14px] text-slate-500`}>{userSession.name}</Text>
        )}
      </View>
    </>
  );
}

export const PaymentMethodWallet = memo(PaymentMethodWalletBase);
