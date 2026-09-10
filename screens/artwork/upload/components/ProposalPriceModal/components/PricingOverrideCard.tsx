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
    <View style={[tw`rounded-sm p-5`, { backgroundColor: colors.black }]}>
      <Text style={tw`text-white font-sans-semibold text-base mb-3`}>
        Pricing Override
      </Text>
      <Text style={tw`text-base leading-6 text-slate-300 mb-7`}>
        Our algorithm recommends
        <Text style={tw`text-white font-sans-semibold`}>
          {" $"}
          {recommendedPrice.toLocaleString()}
        </Text>{" "}
        to maximize your sell-through rate based on current market trends.
      </Text>

      <View style={tw`gap-4`}>
        <View style={tw`flex-row gap-3 items-start`}>
          <View
            style={tw`w-8 h-8 rounded-sm bg-[#12284B] items-center justify-center`}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color="#FBBF24"
            />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-base font-sans-semibold text-white`}>
              Automated Approvals
            </Text>
            <Text style={tw`text-sm text-slate-300 mt-1`}>
              Minor adjustments within your tier&apos;s threshold are instantly
              approved.
            </Text>
          </View>
        </View>

        <View style={tw`flex-row gap-3 items-start`}>
          <View
            style={tw`w-8 h-8 rounded-sm bg-[#12284B] items-center justify-center`}
          >
            <Ionicons name="trending-up-outline" size={16} color="#60A5FA" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-base font-sans-semibold text-white`}>
              Data-Backed Adjustments
            </Text>
            <Text style={tw`text-sm text-slate-300 mt-1`}>
              Significant price changes require verification via past sales or
              exhibitions.
            </Text>
          </View>
        </View>
      </View>

      <View
        style={tw`mt-7 pt-4 border-t border-[#213A62] flex-row items-center`}
      >
        <Feather name="info" size={12} color="#7E95B7" />
        <Text style={tw`text-sm text-[#7E95B7] ml-3`}>
          Overrides are reviewed by our Advisory team within 24 hours.
        </Text>
      </View>
    </View>
  );
}
