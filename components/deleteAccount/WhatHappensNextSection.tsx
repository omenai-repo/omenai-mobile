import React, { useMemo, useCallback } from "react";
import { Text, View, Linking } from "react-native";
import tw from "twrnc";
import { colors } from "config/colors.config";
import {
  whatHappensNextItems,
  WhatHappensNextItem,
  PRIVACY_POLICY_URL
} from "constants/deleteAccount.constants";
import DeleteAccountCard from "./DeleteAccountCard";

type WhatHappensNextItemWithHandler = WhatHappensNextItem & {
  onLinkPress?: () => void;
};

type WhatHappensNextSectionProps = {
  onPrivacyPolicyPress?: () => void;
};

export default function WhatHappensNextSection({
  onPrivacyPolicyPress,
}: WhatHappensNextSectionProps) {
  const handlePrivacyPolicyPress = useCallback(() => {
    if (onPrivacyPolicyPress) {
      onPrivacyPolicyPress();
    } else {
      Linking.openURL(PRIVACY_POLICY_URL);
    }
  }, [onPrivacyPolicyPress]);

  const itemsWithHandlers = useMemo<WhatHappensNextItemWithHandler[]>(() => {
    return whatHappensNextItems.map((item) => ({
      ...item,
      onLinkPress: item.linkText ? handlePrivacyPolicyPress : undefined,
    }));
  }, [handlePrivacyPolicyPress]);

  return (
    <DeleteAccountCard>
      <Text
        style={tw`text-[18px] font-bold mb-5 text-[${colors.primary_black}]`}
      >
        What happens next
      </Text>
      <View style={tw`gap-4`}>
        {itemsWithHandlers.map((item: WhatHappensNextItemWithHandler, index: number) => (
          <View key={item.id} style={tw`flex-row items-start`}>
            <View
              style={tw`w-6 h-6 rounded-full items-center justify-center mr-3 mt-0.5 flex-shrink-0 bg-[${colors.grey50}]`}
            >
              <Text
                style={tw`text-xs font-semibold text-[${colors.primary_black}]`}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={tw`text-sm flex-1 text-[${colors.primary_black}]`}
            >
              {item.text}
              {item.boldText && (
                <Text style={tw`font-bold text-[${colors.primary_black}]`}>
                  {item.boldText}
                </Text>
              )}
              {item.linkText && (
                <Text
                  style={tw`text-[#0066CC] underline`}
                  onPress={item.onLinkPress}
                >
                  {item.linkText}
                </Text>
              )}
              {item.textAfter}
            </Text>
          </View>
        ))}
      </View>
    </DeleteAccountCard>
  );
}

