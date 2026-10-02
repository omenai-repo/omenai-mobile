import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { utils_formatPrice } from "#utils/commerce/utils_priceFormatter";
import ArtworkStatusBadge from "#components/artwork/ArtworkStatusBadge";
import { useAppStore } from "#store/app/appStore";

interface ArtworkPriceSectionProps {
  availability: boolean;
  shouldShowPrice: string;
  usd_price: number;
  userType: string;
}

export default function ArtworkPriceSection({
  availability,
  shouldShowPrice,
  usd_price,
  userType,
}: Readonly<ArtworkPriceSectionProps>) {
  const { isLoggedIn } = useAppStore();

  if (!isLoggedIn) return null;

  return (
    <View>
      <Text
        style={tw`text-xs font-extralight tracking-widest uppercase text-slate-500 mb-2`}
      >
        Price
      </Text>
      {availability ? (
        <Text style={tw`text-3xl text-dark font-extralight tracking-wide`}>
          {shouldShowPrice === "Yes" || ["gallery", "artist"].includes(userType)
            ? utils_formatPrice(Number(usd_price))
            : "Price on request"}
        </Text>
      ) : (
        <ArtworkStatusBadge status="Sold" />
      )}
    </View>
  );
}
