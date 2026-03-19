import { Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { colors } from "#config/colors.config";

type PricingOverrideCardProps = {
  recommendedPrice: number;
};

export default function PricingOverrideCard({
  recommendedPrice,
}: Readonly<PricingOverrideCardProps>) {
  return (
    <View style={[tw`rounded-md p-4 mb-4`, { backgroundColor: colors.black }]}>
      <Text style={tw`text-white font-sans-semibold text-base mb-2`}>
        Pricing Override
      </Text>
      <Text style={tw`text-[12px] leading-5 text-slate-300 mb-4`}>
        Our algorithm recommends
        <Text style={tw`text-white font-sans-semibold`}>
          {" $"}
          {recommendedPrice.toLocaleString()}
        </Text>{" "}
        to maximize your sell-through rate based on current market trends.
      </Text>

      <View style={tw`gap-3`}>
        <View style={tw`flex-row gap-3 items-start`}>
          <View
            style={tw`w-8 h-8 rounded-md bg-[#12284B] items-center justify-center`}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color="#FBBF24"
            />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-xs font-sans-semibold text-white`}>
              Automated Approvals
            </Text>
            <Text style={tw`text-[11px] text-slate-300 mt-0.5`}>
              Minor adjustments within your tier&apos;s threshold are instantly
              approved.
            </Text>
          </View>
        </View>

        <View style={tw`flex-row gap-3 items-start`}>
          <View
            style={tw`w-8 h-8 rounded-md bg-[#12284B] items-center justify-center`}
          >
            <Ionicons name="trending-up-outline" size={16} color="#60A5FA" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-xs font-sans-semibold text-white`}>
              Data-Backed Adjustments
            </Text>
            <Text style={tw`text-[11px] text-slate-300 mt-0.5`}>
              Significant price changes require verification via past sales or
              exhibitions.
            </Text>
          </View>
        </View>
      </View>

      <View
        style={tw`mt-4 pt-3 border-t border-[#213A62] flex-row items-center`}
      >
        <Feather name="info" size={12} color="#7E95B7" />
        <Text style={tw`text-[11px] text-[#7E95B7] ml-2`}>
          Overrides are reviewed by our Advisory team within 24 hours.
        </Text>
      </View>
    </View>
  );
}
