import React from "react";
import { View, Text, Pressable, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import { MotiView } from "moti";

interface WalletBalanceItemProps {
  label: string;
  balance: number | string | undefined;
  showBalance: boolean;
  onToggleVisibility?: () => void;
  isLoading: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
  isMain?: boolean;
}

export const WalletBalanceItem = ({
  label,
  balance,
  showBalance,
  onToggleVisibility,
  isLoading,
  containerStyle,
  isMain = false,
}: WalletBalanceItemProps) => {
  const skeletonStyle = tw`bg-[#ffffff20] rounded-md`;

  const BalanceSkeleton = ({ style }: { style: any }) => (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, type: "timing", duration: 800 }}
      style={[skeletonStyle, style]}
    />
  );

  return (
    <View style={containerStyle}>
      <View style={tw`flex-row items-center gap-4`}>
        <Text style={tw`text-sm font-sans-regular text-neutral-300`}>
          {label}
        </Text>
        {onToggleVisibility && (
          <Pressable onPress={onToggleVisibility}>
            <Ionicons
              name={showBalance ? "eye-outline" : "eye-off-outline"}
              color={tw.color("neutral-300")}
              size={16}
            />
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <BalanceSkeleton
          style={tw.style(
            `${isMain ? "h-8 w-40" : "h-6 w-24"} mt-1.5`,
            skeletonStyle,
          )}
        />
      ) : (
        <Text style={tw.style(`text-white mt-1.5 text-xl font-semibold`)}>
          {showBalance
            ? balance !== undefined
              ? typeof balance === "number"
                ? utils_formatPrice(balance)
                : balance
              : "$0"
            : "****"}
        </Text>
      )}
    </View>
  );
};
