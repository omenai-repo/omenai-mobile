import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import ConsentCheckbox from "#components/inputs/ConsentCheckbox";

type AgreementSectionProps = {
  agreementCount: number;
  priceConsent: boolean;
  acknowledgment: boolean;
  penaltyConsent: boolean;
  onTogglePriceConsent: () => void;
  onToggleAcknowledgment: () => void;
  onTogglePenaltyConsent: () => void;
  onOpenTerms: () => void;
};

export default function AgreementSection({
  agreementCount,
  priceConsent,
  acknowledgment,
  penaltyConsent,
  onTogglePriceConsent,
  onToggleAcknowledgment,
  onTogglePenaltyConsent,
  onOpenTerms,
}: Readonly<AgreementSectionProps>) {
  return (
    <View style={tw`bg-amber-50 border border-amber-200 rounded-md p-3 mb-4`}>
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <View style={tw`flex-row items-center`}>
          <MaterialIcons name="warning-amber" size={16} color="#B45309" />
          <Text
            style={tw`text-[11px] font-sans-semibold text-amber-800 ml-1 uppercase`}
          >
            Exclusivity & Pricing Agreement
          </Text>
        </View>
        <Text style={tw`text-[10px] text-amber-700 font-sans-semibold`}>
          {agreementCount}/3
        </Text>
      </View>

      <View style={tw`bg-white border border-amber-200 rounded-md p-3 mb-2`}>
        <ConsentCheckbox checked={priceConsent} onToggle={onTogglePriceConsent}>
          I agree to list this artwork at the finalized listing price.
        </ConsentCheckbox>

        <ConsentCheckbox
          checked={acknowledgment}
          onToggle={onToggleAcknowledgment}
        >
          I agree to a 90-day platform exclusivity period where this artwork
          cannot be sold elsewhere. (
          <Text
            onPress={onOpenTerms}
            style={tw`underline font-sans-semibold text-amber-800`}
          >
            Omenai&apos;s Terms of Service
          </Text>
          )
        </ConsentCheckbox>

        <ConsentCheckbox
          checked={penaltyConsent}
          onToggle={onTogglePenaltyConsent}
          isLast
        >
          I acknowledge that breaching exclusivity incurs a 10% penalty fee on
          my next platform sale. (
          <Text
            onPress={onOpenTerms}
            style={tw`underline font-sans-semibold text-amber-800`}
          >
            Omenai&apos;s Terms of Service
          </Text>
          )
        </ConsentCheckbox>
      </View>

      <View style={tw`flex-row items-center justify-between mt-1`}>
        <View style={tw`flex-row items-center gap-1`}>
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              style={[
                tw`h-1.5 w-5 rounded-full`,
                step <= agreementCount ? tw`bg-slate-600` : tw`bg-amber-200`,
              ]}
            />
          ))}
        </View>
        <Text style={tw`text-[10px] text-amber-700`}>{agreementCount}/3</Text>
      </View>
    </View>
  );
}
