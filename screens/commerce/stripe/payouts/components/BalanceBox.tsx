import {
  Linking,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { colors } from "#config/colors.config";
import { useModalStore } from "#store/account/modal/modalStore";
import { utils_getCurrencySymbol } from "#utils/location/utils_getCurrencySymbol";
import { generateStripeLoginLink } from "#services/commerce/stripe/generateStripeLoginLink";
import { utils_formatPrice } from "#utils/commerce/utils_priceFormatter";
import tw from "twrnc";

export default function BalanceBox({
  account_id,
  balance,
}: Readonly<{
  account_id: string;
  balance: any;
}>) {
  const [pendingLoginLink, setPendingLoginLink] = useState(false);

  const { updateModal } = useModalStore();

  async function generateLoginLink() {
    setPendingLoginLink(true);
    const res = await generateStripeLoginLink(account_id);

    if (res?.isOk) {
      const supportedLink = await Linking.canOpenURL(res.url);
      if (supportedLink) {
        setPendingLoginLink(false);
        await Linking.openURL(res.url);
      }
    } else {
      updateModal({
        message: "Something went wrong, please try again or contact support",
        modalType: "error",
        showModal: true,
      });
    }

    setPendingLoginLink(false);
  }

  if (balance) {
    const currency = utils_getCurrencySymbol(balance.available[0].currency);

    return (
      <View
        style={tw`border border-[#333333] bg-[${colors.primary_black}] rounded-sm p-2.5 px-[25px] py-[25px]`}
      >
        <Text
          style={tw`text-left text-sm uppercase text-white mt-2.5 opacity-70 tracking-[1px] px-[5px]`}
        >
          Payout Balance
        </Text>
        <Text
          style={tw`text-[32px] font-semibold text-left mt-2.5 text-white px-[5px]`}
        >
          {utils_formatPrice(balance.pending[0].amount / 100, currency)}
        </Text>
        <View style={tw`gap-5 mt-[30px] pt-0`}>
          <View style={tw`bg-white/10 rounded-sm p-3 flex-row`}>
            <Text style={tw`text-[13px] text-white/90 flex-1 leading-[18px]`}>
              Balance on Stripe is automatically transferred to your connected
              bank account.
            </Text>
          </View>

          <TouchableOpacity
            style={tw`h-10 bg-white items-center justify-center border border-white rounded-sm flex-row gap-2.5`}
            onPress={generateLoginLink}
            disabled={pendingLoginLink}
          >
            {pendingLoginLink ? (
              <ActivityIndicator color={colors.primary_black} size="small" />
            ) : (
              <Text style={tw`text-[${colors.primary_black}] font-medium`}>
                Open Stripe dashboard
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
