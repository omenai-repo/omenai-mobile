import { useRef, useState } from "react";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { useModalStore } from "#store/modal/modalStore";
import { getArtistCurrencySymbol } from "#utils/utils_getArtistCurrencySymbol";
import { getArtworkPriceForArtist } from "#services/artworks/getArtworkPriceForArtist";
import { uploadArtworkStore } from "#store/gallery/uploadArtworkStore";
import { useAppStore } from "#store/app/appStore";
import LottieView from "lottie-react-native";
import loaderAnimation from "../../../assets/other/loader-animation.json";
import { extractNumberString } from "#utils/utils_editStringToNumber";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import { colors } from "#config/colors.config";
import ConsentCheckbox from "#components/inputs/ConsentCheckbox";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";

export default function ArtworkPriceReviewScreen({
  onConfirm,
}: Readonly<{
  onConfirm: () => void;
}>) {
  const { height } = useWindowDimensions();
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

  // consent states like web
  const [acknowledgment, setAcknowledgment] = useState(false);
  const [penaltyConsent, setPenaltyConsent] = useState(false);
  const [priceConsent, setPriceConsent] = useState(false);

  // Display price gating based on artist categorization
  const isEmerging = userSession?.categorization?.toLowerCase() === "emerging";
  const [displayPriceValue, setDisplayPriceValue] = useState(
    isEmerging ? "Yes" : "",
  );

  const canProceed =
    acknowledgment &&
    penaltyConsent &&
    priceConsent &&
    displayPriceValue !== "";

  // prepare query inputs
  const heightNum = Number.parseFloat(
    extractNumberString(artworkUploadData.height || ""),
  );
  const widthNum = Number.parseFloat(
    extractNumberString(
      artworkUploadData.width || artworkUploadData.length || "",
    ),
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
      };

      const response = await getArtworkPriceForArtist(payload);

      if (!response?.isOk) {
        throw new Error(response?.data?.message || "Failed to fetch price");
      }

      // update upload store with returned price fields so rest of flow can use it
      updateArtworkUploadData("price", response.data.price);
      updateArtworkUploadData("usd_price", response.data.usd_price);
      updateArtworkUploadData("currency", response.data.currency);
      if (
        !artworkUploadData.shouldShowPrice ||
        userSession?.categorization?.toLowerCase() === "emerging"
      ) {
        updateArtworkUploadData(
          "shouldShowPrice",
          response.data.shouldShowPrice,
        );
        // Also sync local state
        if (userSession?.categorization?.toLowerCase() === "emerging") {
          setDisplayPriceValue("Yes");
        }
      }

      return response.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // handle the in-app opening of Terms/Legal link
  const openTerms = async () => {
    try {
      await WebBrowser.openBrowserAsync("https://omenai.app/legal?ent=artist");
    } catch {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Something went wrong while opening the Terms of Agreement.",
      });
    }
  };

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
        style={tw.style(`flex-1 justify-center items-center`, {
          marginTop: height / 8,
        })}
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
              tw`px-4 py-2 rounded-md`,
              { backgroundColor: colors.black },
            ]}
          >
            <Text style={[tw`text-white`]}>Retry</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={tw`px-4 py-2 bg-white border border-gray-300 rounded-md`}
          >
            <Text style={tw`text-black`}>Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 mb-[40px] rounded-md`}>
      <View
        style={tw`bg-white items-center rounded-md p-5 border border-neutral-200 mb-6`}
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

      {/* Exclusivity / terms alert (mimics web Alert) */}
      <View
        style={tw`bg-amber-50/50 border border-amber-200 rounded-md px-4 py-5 mb-6`}
      >
        <View style={tw`flex-row items-center justify-between mb-5`}>
          <View style={tw`flex-row items-center`}>
            <Ionicons
              name="warning-outline"
              size={20}
              color={tw.color("amber-900")}
              style={tw`mr-3`}
            />
            <Text style={tw`text-amber-900 font-semibold`}>
              Exclusivity Agreement
            </Text>
          </View>
          <View
            style={[
              tw`px-2.5 py-1 rounded-full`,
              canProceed ? tw`bg-green-100` : tw`bg-gray-100`,
            ]}
          >
            <Text
              style={[
                tw`text-[10px] font-semibold`,
                canProceed ? tw`text-green-700` : tw`text-gray-500`,
              ]}
            >
              {
                [priceConsent, acknowledgment, penaltyConsent].filter(Boolean)
                  .length
              }{" "}
              of 3
            </Text>
          </View>
        </View>
        <View style={tw`flex-1`}>
          <ConsentCheckbox
            checked={priceConsent}
            onToggle={() => setPriceConsent((s) => !s)}
          >
            I accept the price stipulated for this artwork and agree to have it
            listed on the platform at this price. I understand that I may cancel
            this upload if I do not agree.
          </ConsentCheckbox>

          <ConsentCheckbox
            checked={acknowledgment}
            onToggle={() => setAcknowledgment((s) => !s)}
          >
            I acknowledge that this artwork is subject to a 90-day exclusivity
            period with Omenai as stipulated in the{" "}
            <Text onPress={openTerms} style={tw`underline font-semibold`}>
              Terms of Agreement
            </Text>{" "}
            and may not be sold through external channels during this time.
          </ConsentCheckbox>

          <ConsentCheckbox
            checked={penaltyConsent}
            onToggle={() => setPenaltyConsent((s) => !s)}
            isLast
          >
            I agree that any breach of this exclusivity obligation will result
            in a 10% penalty fee deducted from my next successful sale on the
            platform as stipulated in the{" "}
            <Text onPress={openTerms} style={tw`underline font-semibold`}>
              Terms of Agreement
            </Text>
            .
          </ConsentCheckbox>
        </View>
      </View>

      {/* Display Price Option */}
      <View
        style={tw`bg-white border border-[#E5E7EB] rounded-md px-4 py-5 mb-6`}
      >
        <Text style={tw`text-sm font-semibold text-gray-800 mb-1`}>
          Price Display
        </Text>
        <Text style={tw`text-xs text-gray-400`}>
          Would you like to mask the artwork's price from public view?
        </Text>

        <View style={tw`mt-3`}>
          <CustomSelectPicker
            label=""
            data={
              isEmerging
                ? [{ label: "Yes, display the price", value: "Yes" }]
                : [
                    { label: "Yes, display the price", value: "Yes" },
                    { label: "No, don't display the price", value: "No" },
                  ]
            }
            placeholder="Select"
            value={displayPriceValue}
            handleSetValue={(item) => {
              setDisplayPriceValue(item.value);
              updateArtworkUploadData("shouldShowPrice", item.value);
            }}
            disable={isEmerging}
          />
        </View>
        {isEmerging && (
          <Text style={tw`text-xs text-slate-500 mt-2`}>
            Pricing visibility change is unlocked at higher artist tiers.
          </Text>
        )}
      </View>

      <View style={tw`flex-row gap-4 mt-4`}>
        <Pressable
          onPress={() => {
            navigation.goBack();
            setActiveIndex(1);
            clearData();
          }}
          style={tw`flex-1 py-3 border border-gray-400 rounded-md justify-center items-center`}
        >
          <Text style={tw`text-gray-700 font-semibold`}>Cancel</Text>
        </Pressable>

        <Pressable
          onPress={handleConfirmPress}
          style={[
            tw`flex-1 py-3 rounded-md justify-center items-center`,
            canProceed
              ? { backgroundColor: colors.black }
              : { backgroundColor: "#22222260" },
          ]}
          disabled={!canProceed}
        >
          <Text style={[tw`font-semibold`, { color: colors.white }]}>
            Upload
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
