import { useRef, useState } from "react";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { useModalStore } from "#store/modal/modalStore";
import { getArtworkPriceForArtist } from "#services/artworks/getArtworkPriceForArtist";
import { uploadArtworkStore } from "#store/gallery/uploadArtworkStore";
import { useAppStore } from "#store/app/appStore";
import LottieView from "lottie-react-native";
import loaderAnimation from "../../../assets/other/loader-animation.json";
import { extractNumberString } from "#utils/utils_editStringToNumber";
import { useQuery } from "@tanstack/react-query";
import { colors } from "#config/colors.config";
import { screenName } from "#constants/screenNames.constants";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PriceDisputeTriggerCard from "./PriceDisputeTriggerCard";
import ArtistExclusivityAgreementSection, {
  isArtistExclusivityComplete,
} from "./ArtistExclusivityAgreementSection";

export default function ArtworkPriceReviewScreen({
  onConfirm,
}: Readonly<{
  onConfirm: () => void;
}>) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { updateModal } = useModalStore();
  const {
    setActiveIndex,
    updateArtworkUploadData,
    artworkUploadData,
    clearData,
  } = uploadArtworkStore();
  const { userSession } = useAppStore();
  const animation = useRef<LottieView | null>(null);

  const parseHasAutoApprovalsRemaining = (value: unknown): boolean => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value > 0;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["false", "0", "no", "none", ""].includes(normalized)) {
        return false;
      }

      if (["true", "1", "yes"].includes(normalized)) {
        return true;
      }

      const numeric = Number.parseFloat(normalized);
      return Number.isNaN(numeric) ? true : numeric > 0;
    }

    return Boolean(value);
  };

  // consent states like web
  const [acknowledgment, setAcknowledgment] = useState(false);
  const [penaltyConsent, setPenaltyConsent] = useState(false);
  const [priceConsent, setPriceConsent] = useState(false);

  // Display price gating based on artist categorization
  const normalizedCategorization = userSession?.categorization?.trim().toLowerCase();
  const isCustomPricingEligibleArtist = [
    "emerging",
    "early mid-career",
  ].includes(normalizedCategorization || "");
  const [displayPriceValue, setDisplayPriceValue] = useState(
    isCustomPricingEligibleArtist ? "Yes" : ""
  );

  const exclusivityComplete = isArtistExclusivityComplete(
    priceConsent,
    acknowledgment,
    penaltyConsent,
  );

  const canProceed =
    exclusivityComplete &&
    (isCustomPricingEligibleArtist || displayPriceValue !== "");

  // prepare query inputs
  const heightNum = Number.parseFloat(
    extractNumberString(artworkUploadData.height || "")
  );
  const widthNum = Number.parseFloat(
    extractNumberString(
      artworkUploadData.width || artworkUploadData.length || ""
    )
  );

  // Use tanstack/react-query for fetching price
  const {
    data: priceData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "fetch_artwork_price",
      artworkUploadData.medium,
      userSession?.categorization,
      userSession?.base_currency,
      heightNum,
      widthNum,
    ],
    queryFn: async () => {
      const payload = {
        medium: artworkUploadData.medium,
        category: userSession.categorization,
        currency: userSession.base_currency,
        height: heightNum,
        width: widthNum,
        artistId: userSession.id,
      };

      const response = await getArtworkPriceForArtist(payload);

      if (!response?.isOk) {
        const fullErrorMessage =
          response?.message ||
          response?.body?.message ||
          response?.raw?.message ||
          "Failed to fetch price";

        console.error("Artwork price API error:", {
          payload,
          response,
          message: fullErrorMessage,
        });

        throw new Error(fullErrorMessage);
      }

      // update upload store with returned price fields so rest of flow can use it
      updateArtworkUploadData("price", response.data.price);
      updateArtworkUploadData("usd_price", response.data.usd_price);
      updateArtworkUploadData("currency", response.data.currency);
      updateArtworkUploadData(
        "algorithm_recommendation",
        response.data.algorithm_recommendation || response.data.price_data
      );
      const hasAutoApprovalsRemaining = parseHasAutoApprovalsRemaining(
        response.data.hasAutoApprovalsRemaining
      );

      updateArtworkUploadData(
        "hasAutoApprovalsRemaining",
        hasAutoApprovalsRemaining ? 1 : 0
      );
      if (
        !artworkUploadData.shouldShowPrice ||
        isCustomPricingEligibleArtist
      ) {
        updateArtworkUploadData(
          "shouldShowPrice",
          response.data.shouldShowPrice
        );
        // Also sync local state
        if (isCustomPricingEligibleArtist) {
          setDisplayPriceValue("Yes");
        }
      }

      return response.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Upload/confirm handler for mobile — call onConfirm only when all consents are accepted
  const handleConfirmPress = () => {
    if (!canProceed) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Please accept all conditions before uploading.",
      });
      return;
    }
    // call the passed in onConfirm (which in your flow probably triggers the upload)
    onConfirm();
  };

  if (isLoading) {
    return (
      <View
        style={[
          tw`flex-1 justify-center items-center`,
          { marginTop: height / 8 },
        ]}
      >
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 120,
            height: 120,
          }}
          source={loaderAnimation}
        />
        <Text style={tw`text-lg font-semibold`}>
          Determining price of art piece...
        </Text>
      </View>
    );
  }

  if (isError || !priceData) {
    return (
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <Text style={tw`text-red-500 text-center mb-4`}>
          Failed to load price. Please try again.
        </Text>
        <View style={tw`flex-row gap-4`}>
          <Pressable
            onPress={() => refetch()}
            style={[
              tw`px-4 py-2 rounded-sm`,
              { backgroundColor: colors.black },
            ]}
          >
            <Text style={[tw`text-white`]}>Retry</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={tw`px-4 py-2 bg-white border border-gray-300 rounded-sm`}
          >
            <Text style={tw`text-black`}>Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 rounded-sm`}>
      <View
        style={tw`bg-white items-center rounded-sm p-5 border border-neutral-200 mb-6`}
      >
        <Text
          style={[
            tw`text-base font-sans-medium text-center uppercase`,
            { color: colors.black },
          ]}
        >
          Proposed Listing Price
        </Text>
        <Text style={[tw`text-5xl font-bold mt-3`, { color: colors.black }]}>
          {priceData?.usd_price
            ? `$${Number(priceData.usd_price).toLocaleString()}`
            : "-"}
        </Text>

        <View style={tw`bg-slate-50 rounded-full px-3 py-2 mt-2`}>
          <Text style={tw`text-xs text-slate-400 font-sans-medium`}>
            Local currency equivalent:{" "}
            <Text style={tw`text-slate-500 font-sans-semibold`}>
              {priceData.currency}{" "}
              {Number(priceData.price).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </Text>
          </Text>
        </View>
        <Text style={tw`text-xs text-slate-400 mt-3 text-center`}>
          This price is calculated based on your artist tier, the medium, and
          dimensions of the artwork. Consistent pricing helps build collector
          trust.
        </Text>
      </View>

      <PriceDisputeTriggerCard
        onPress={() =>
          navigation.navigate(screenName.artist.proposalPrice as never)
        }
      />

      <View style={tw`mb-6`}>
        <ArtistExclusivityAgreementSection
          priceConsent={priceConsent}
          acknowledgment={acknowledgment}
          penaltyConsent={penaltyConsent}
          onTogglePriceConsent={() => setPriceConsent((s) => !s)}
          onToggleAcknowledgment={() => setAcknowledgment((s) => !s)}
          onTogglePenaltyConsent={() => setPenaltyConsent((s) => !s)}
          subtitle="All artist listings on Omenai include a 90-day exclusivity period. You must confirm each point below before uploading."
        />
      </View>

      {/* Display Price Option */}
      {!isCustomPricingEligibleArtist && (
        <View
          style={tw`bg-white border border-[#E5E7EB] rounded-sm px-4 py-5 mb-6`}
        >
          <Text style={tw`text-sm font-semibold text-gray-800 mb-1`}>
            Pricing Visibility
          </Text>
          <Text style={tw`text-xs text-gray-400`}>
            Control how collectors view the price of this artwork.
          </Text>

          <View style={tw`mt-3`}>
            <CustomSelectPicker
              label=""
              data={[
                {
                  label: "Public: Display price to all collectors",
                  value: "Yes",
                },
                {
                  label: "Private: Mask price (inquiries only)",
                  value: "No",
                },
              ]}
              placeholder="Select"
              value={displayPriceValue}
              handleSetValue={(item) => {
                setDisplayPriceValue(item.value);
                updateArtworkUploadData("shouldShowPrice", item.value);
              }}
            />
          </View>
        </View>
      )}

      <View
        style={[
          tw`mt-1`,
          {
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}
      >
        <View style={tw`flex-row gap-3`}>
          <Pressable
            onPress={() => {
              navigation.goBack();
              setActiveIndex(1);
              clearData();
            }}
            style={tw`flex-1 py-3 border border-gray-400 rounded-sm justify-center items-center`}
          >
            <Text style={tw`text-gray-700 font-sans-medium`}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleConfirmPress}
            style={[
              tw`flex-1 py-3 rounded-sm justify-center items-center`,
              canProceed
                ? { backgroundColor: colors.black }
                : { backgroundColor: "#22222260" },
            ]}
            disabled={!canProceed}
          >
            <Text style={[tw`font-sans-medium`, { color: colors.white }]}>
              Upload
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
