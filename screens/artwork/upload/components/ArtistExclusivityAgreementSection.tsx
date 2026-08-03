import { Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import ConsentCheckbox from "#components/inputs/ConsentCheckbox";
import { useModalStore } from "#store/account/modal/modalStore";

export type ArtistExclusivityAgreementSectionProps = {
  priceConsent: boolean;
  acknowledgment: boolean;
  penaltyConsent: boolean;
  onTogglePriceConsent: () => void;
  onToggleAcknowledgment: () => void;
  onTogglePenaltyConsent: () => void;
  subtitle: string;
};

export function isArtistExclusivityComplete(
  priceConsent: boolean,
  acknowledgment: boolean,
  penaltyConsent: boolean,
) {
  return priceConsent && acknowledgment && penaltyConsent;
}

// Shared exclusivity UI for artist upload flows (emerging price review + self-priced pricing step).
export default function ArtistExclusivityAgreementSection({
  priceConsent,
  acknowledgment,
  penaltyConsent,
  onTogglePriceConsent,
  onToggleAcknowledgment,
  onTogglePenaltyConsent,
  subtitle,
}: Readonly<ArtistExclusivityAgreementSectionProps>) {
  const { updateModal } = useModalStore();

  const complete = isArtistExclusivityComplete(
    priceConsent,
    acknowledgment,
    penaltyConsent,
  );

  const openArtistTerms = async () => {
    try {
      await WebBrowser.openBrowserAsync("https://omenai.app/legal?ent=artist");
    } catch (error: any) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: error?.message || error?.body?.message || "Something went wrong while opening the Terms of Agreement.",
      });
    }
  };

  return (
    <View
      style={tw`rounded-lg border border-amber-600 bg-amber-50 overflow-hidden`}
    >
      <View style={tw`bg-amber-700 px-3 py-2.5 flex-row items-center gap-2`}>
        <Ionicons name="alert-circle" size={22} color="#fff" />
        <View style={tw`flex-1`}>
          <Text style={tw`text-white font-sans-semibold text-sm`}>
            Required: exclusivity agreement
          </Text>
          <Text style={tw`text-amber-100 text-xs mt-0.5`}>{subtitle}</Text>
        </View>
      </View>
      <View style={tw`px-3 py-3 gap-1`}>
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <Text style={tw`text-amber-950 font-semibold text-sm`}>
            Mark all to continue
          </Text>
          <View
            style={tw`px-2 py-1 rounded-full ${complete ? "bg-green-100" : "bg-white border border-amber-300"}`}
          >
            <Text
              style={tw`text-[10px] font-semibold ${complete ? "text-green-800" : "text-amber-900"}`}
            >
              {[priceConsent, acknowledgment, penaltyConsent].filter(Boolean).length}{" "}
              of 3
            </Text>
          </View>
        </View>
        <ConsentCheckbox checked={priceConsent} onToggle={onTogglePriceConsent}>
          I agree to list this artwork at the finalized listing price
        </ConsentCheckbox>
        <ConsentCheckbox
          checked={acknowledgment}
          onToggle={onToggleAcknowledgment}
        >
          I acknowledge the 90-day exclusivity period per Omenai&apos;s{" "}
          <Text onPress={openArtistTerms} style={tw`underline font-semibold`}>
            Terms of Use
          </Text>{" "}
          and will not sell this piece externally during that period.
        </ConsentCheckbox>
        <ConsentCheckbox
          checked={penaltyConsent}
          onToggle={onTogglePenaltyConsent}
          isLast
        >
          I accept that a breach of exclusivity incurs a 10% penalty on my next
          platform sale.
        </ConsentCheckbox>
      </View>
    </View>
  );
}
