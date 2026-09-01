import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { utils_formatPrice } from "#utils/commerce/utils_priceFormatter";
import { utils_getCurrencySymbol } from "#utils/location/utils_getCurrencySymbol";
import CardHeaderStripe from "#components/general/CardHeaderStripe";
import tw from "twrnc";

type ProposedPrice = {
  price: number;
  usd_price: number;
  currency: string;
};

type ArtistPricingCardProps = Readonly<{
  currentPricing?: {
    price: number;
    usd_price: number;
    currency: string;
  };
  proposedPrice: ProposedPrice | null;
}>;

export default function ArtistPricingCard({
  currentPricing,
  proposedPrice,
}: ArtistPricingCardProps) {
  const usdSymbol = utils_getCurrencySymbol("USD");

  return (
    <View
      style={tw`bg-white rounded-sm border border-[#E8ECF4] overflow-hidden`}
    >
      <CardHeaderStripe
        style={tw`mb-4`}
        title="Pricing"
        icon="pricetag-outline"
      />

      {currentPricing && (
        <View
          style={tw`mx-5 mb-1 bg-[#FAFAFA] rounded-sm border border-[#E8ECF4] px-4 py-3 flex-row justify-between items-center`}
        >
          <View style={tw`gap-0.5`}>
            <Text
              style={tw`font-sans-regular text-xs text-[#7A8AA8] tracking-wide uppercase`}
            >
              Current price
            </Text>
            <Text style={tw`font-sans-bold text-xl text-[#0F172A]`}>
              {utils_formatPrice(currentPricing.usd_price, usdSymbol)}
            </Text>
          </View>
          <View style={tw`bg-[#E8ECF4] rounded-sm px-2.5 py-1`}>
            <Text style={tw`font-sans-semibold text-xs text-[#0F172A]`}>
              USD
            </Text>
          </View>
        </View>
      )}

      {proposedPrice ? (
        <View
          style={tw`mx-5 mb-5 mt-3 bg-[#ECFDF5] rounded-sm border border-[#A7F3D0] px-4 py-3 gap-2`}
        >
          <View style={tw`flex-row items-center gap-2`}>
            <View style={tw`w-1.5 h-1.5 rounded-full bg-[#10B981]`} />
            <Text
              style={tw`font-sans-regular text-xs text-[#065F46] tracking-wide uppercase`}
            >
              Proposed new price
            </Text>
          </View>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`font-sans-bold text-2xl text-[#065F46]`}>
              {utils_formatPrice(proposedPrice.usd_price, usdSymbol)}
            </Text>
            <View style={tw`bg-[#A7F3D0] rounded-sm px-2.5 py-1`}>
              <Text style={tw`font-sans-semibold text-xs text-[#065F46]`}>
                USD
              </Text>
            </View>
          </View>
          <Text style={tw`font-sans-regular text-xs text-[#2D6A4F]`}>
            Save changes below to apply this price.
          </Text>
        </View>
      ) : (
        <View style={tw`mx-5 mb-5 mt-2 flex-row items-start gap-2`}>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color="#94A3C4"
            style={tw`mt-0.5`}
          />
          <Text
            style={tw`font-sans-regular text-sm text-[#94A3C4] flex-1 leading-5`}
          >
            Enter new dimensions and tap{" "}
            <Text style={tw`font-sans-semibold text-[#0F172A]`}>
              Re-evaluate
            </Text>{" "}
            to see the proposed price.
          </Text>
        </View>
      )}
    </View>
  );
}
