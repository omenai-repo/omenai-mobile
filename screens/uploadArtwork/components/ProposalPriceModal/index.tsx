import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import * as WebBrowser from "expo-web-browser";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { useModalStore } from "#store/modal/modalStore";
import { useAppStore } from "#store/app/appStore";
import { useKeyboardHeight } from "#hooks/useKeyboardHeight";
import { useProposalPriceStore } from "#store/artworks/proposalPriceStore";
import { uploadArtworkStore } from "#store/gallery/uploadArtworkStore";
import uploadArtworkImage from "#services/artworks/uploadArtworkImage";
import { createUploadedArtworkData } from "#utils/utils_createUploadedArtworkData";
import {
  getImageAspectRatio,
  getRatioString,
} from "#utils/utils_getImageAspectRatio";
import { createPriceReviewRequest } from "#services/artworks/createPriceReviewRequest";
import { screenName } from "#constants/screenNames.constants";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import LongBlackButton from "#components/buttons/LongBlackButton";
import AgreementSection from "./components/AgreementSection";
import JustificationSection from "./components/JustificationSection";
import PriceStatusNotice from "./components/PriceStatusNotice";
import PricingOverrideCard from "./components/PricingOverrideCard";
import { JustificationType } from "./types";
import { uploadToAppwrite } from "#utils/uploadToAppwrite";

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

const getSubmissionValidationError = ({
  nextPrice,
  recommendedPrice,
  allTermsAccepted,
  requiresJustification,
  justificationType,
  needsProof,
  hasProof,
  proposalReason,
  userId,
  artworkImageUri,
  proofFormat,
  justificationFileMeta,
}: {
  nextPrice: number;
  recommendedPrice: number;
  allTermsAccepted: boolean;
  requiresJustification: boolean;
  justificationType: JustificationType | "";
  needsProof: boolean;
  hasProof: boolean;
  proposalReason: string;
  userId?: string;
  artworkImageUri?: string;
  proofFormat: "LINK" | "DOCUMENT";
  justificationFileMeta: {
    uri: string;
    name: string;
    type: string;
    size?: number;
  } | null;
}) => {
  if (Number.isNaN(nextPrice) || nextPrice <= 0) {
    return "Please enter a valid target listing price.";
  }

  if (nextPrice < recommendedPrice) {
    return `Price cannot be set lower than the algorithm baseline of $${recommendedPrice.toLocaleString()}.`;
  }

  if (!allTermsAccepted) {
    return "Please accept the exclusivity and pricing agreement.";
  }

  if (requiresJustification && !justificationType) {
    return "Please select a data source / justification.";
  }

  if (requiresJustification && needsProof && !hasProof) {
    return "Proof via link or document is required for this selection.";
  }

  if (requiresJustification && (!proposalReason || proposalReason.trim() === "")) {
    return "Please provide contextual notes to justify this price change.";
  }

  if (!userId) {
    return "Unable to identify artist profile. Please sign in again.";
  }

  if (!artworkImageUri) {
    return "Artwork image is missing. Please upload/select an image.";
  }

  if (
    requiresJustification &&
    needsProof &&
    proofFormat === "DOCUMENT" &&
    !justificationFileMeta
  ) {
    return "Please attach a proof document.";
  }

  return null;
};

function ProposalPriceModalImpl() {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const { updateModal } = useModalStore();
  const { userSession } = useAppStore();
  const { image, artworkUploadData, updateArtworkUploadData, clearData } =
    uploadArtworkStore();
  const { setSubmittedProposalPrice } = useProposalPriceStore();
  const iosInput = Platform.OS === "ios" ? { lineHeight: undefined } : {};

  const [proposalPrice, setProposalPrice] = useState("");
  const [proposalReason, setProposalReason] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [priceConsent, setPriceConsent] = useState(false);
  const [acknowledgment, setAcknowledgment] = useState(false);
  const [penaltyConsent, setPenaltyConsent] = useState(false);
  const [justificationType, setJustificationType] = useState<
    JustificationType | ""
  >("");
  const [proofFormat, setProofFormat] = useState<"LINK" | "DOCUMENT">(
    "DOCUMENT",
  );
  const [justificationUrl, setJustificationUrl] = useState("");
  const [justificationFileName, setJustificationFileName] = useState("");
  const [justificationFileMeta, setJustificationFileMeta] = useState<{
    uri: string;
    name: string;
    type: string;
    size?: number;
  } | null>(null);
  const [shouldShowPrice, setShouldShowPrice] = useState<"Yes" | "No">(
    artworkUploadData?.shouldShowPrice === "No" ? "No" : "Yes",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recommendedPrice = Number(artworkUploadData?.usd_price || 0);
  const recommendedPricePlaceholder =
    recommendedPrice > 0 ? recommendedPrice.toLocaleString() : "0";
  const hasAutoApprovalsRemaining = parseHasAutoApprovalsRemaining(
    (artworkUploadData as any)?.hasAutoApprovalsRemaining ?? true,
  );
  const normalizedCategorization =
    (userSession?.categorization || "").trim().toLowerCase();
  const isCustomPricingEligibleArtist = [
    "emerging",
    "early mid-career",
  ].includes(normalizedCategorization);
  const agreementCount = [priceConsent, acknowledgment, penaltyConsent].filter(
    Boolean,
  ).length;

  const allTermsAccepted = agreementCount === 3;
  const proposedNumber = Number.parseFloat(proposalPrice.replaceAll(/,/g, ""));
  const artistCategory = (userSession?.categorization || "").toLowerCase();
  const categoryVariances: Record<string, number> = {
    emerging: 0.1,
    "early mid-career": 0.2,
    "mid-career": 0.25,
    "late mid-career": 0.35,
    established: 0.35,
    elite: 0.35,
  };
  const varianceLimit = categoryVariances[artistCategory] ?? 0.1;
  const autoApproveCap =
    recommendedPrice > 0
      ? recommendedPrice * (1 + varianceLimit)
      : Number.POSITIVE_INFINITY;
  const isPriceEntered =
    proposalPrice.trim().length > 0 && !Number.isNaN(proposedNumber);
  const isAutoApproveZone =
    Number.isNaN(proposedNumber) ||
    (proposedNumber <= autoApproveCap && hasAutoApprovalsRemaining);
  const requiresJustification = isPriceEntered && !isAutoApproveZone;
  const needsProof =
    justificationType === "PAST_SALE" ||
    justificationType === "GALLERY_EXHIBITION";
  const hasProof =
    proofFormat === "LINK"
      ? justificationUrl.trim().length > 0
      : justificationFileName.trim().length > 0;

  const canSubmit =
    proposalPrice.trim().length > 0 &&
    allTermsAccepted &&
    (!requiresJustification ||
      (justificationType !== "" &&
        proposalReason.trim().length > 0 &&
        (!needsProof || hasProof)));

  const supportedProofMimeTypes = new Set(["application/pdf"]);
  const supportedProofExtensions = [".pdf"];

  const uploadProofDocument = async (file: {
    uri: string;
    name: string;
    type: string;
    size?: number;
  }) =>
    uploadToAppwrite({
      bucketId: process.env.EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID!,
      file,
      fallbackName: `proof-${Date.now()}.pdf`,
      fallbackType: "application/pdf",
      errorMessage: "Document upload failed",
    });

  const pickProofDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf"],
      multiple: false,
      copyToCacheDirectory: false,
    });

    if (result.canceled) return;

    const first = result.assets?.[0];
    if (!first) return;

    const fileName = (first.name || "").toLowerCase();
    const mimeType = (first.mimeType || "").toLowerCase();
    const isMimeSupported =
      mimeType.length > 0 && supportedProofMimeTypes.has(mimeType);
    const hasSupportedExtension = supportedProofExtensions.some((ext) =>
      fileName.endsWith(ext),
    );

    if (!isMimeSupported && !hasSupportedExtension) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Unsupported file type. Please upload a PDF document.",
      });
      return;
    }

    setJustificationFileName(first.name || "proof-document");
    setJustificationFileMeta({
      uri: first.uri,
      name: first.name || "proof-document",
      type: first.mimeType || "application/octet-stream",
      size: first.size,
    });
    setJustificationUrl("");
    if (inputError) setInputError(null);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const openTerms = async () => {
    try {
      await WebBrowser.openBrowserAsync("https://omenai.app/legal?ent=artist");
    } catch {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Something went wrong while opening the Terms of Service.",
      });
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const nextPrice = Number.parseFloat(proposalPrice.replaceAll(/,/g, ""));
    const artworkImageAsset = image?.assets?.[0];

    const validationError = getSubmissionValidationError({
      nextPrice,
      recommendedPrice,
      allTermsAccepted,
      requiresJustification,
      justificationType,
      needsProof,
      hasProof,
      proposalReason,
      userId: userSession?.id,
      artworkImageUri: artworkImageAsset?.uri,
      proofFormat,
      justificationFileMeta,
    });

    if (validationError) {
      setInputError(validationError);
      return;
    }

    setInputError(null);
    setIsSubmitting(true);

    try {
      const uploadedArtwork = await uploadArtworkImage({
        uri: artworkImageAsset.uri,
        name: artworkImageAsset.fileName || `artwork-${Date.now()}.jpg`,
        type: artworkImageAsset.mimeType || "image/jpeg",
        size: artworkImageAsset.fileSize,
      });

      if (!uploadedArtwork?.$id) {
        throw new Error("Artwork image upload failed");
      }

      let finalJustificationUrl = justificationUrl;
      if (
        requiresJustification &&
        needsProof &&
        proofFormat === "DOCUMENT" &&
        justificationFileMeta
      ) {
        const uploadedProof = await uploadProofDocument(justificationFileMeta);
        const proofFileId = uploadedProof?.$id;
        const proofBucketId = uploadedProof?.bucketId;

        if (!proofFileId || !proofBucketId) {
          throw new Error("Proof document upload failed");
        }

        finalJustificationUrl = `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${proofBucketId}/files/${proofFileId}/view?project=${process.env.EXPO_PUBLIC_APPWRITE_CLIENT_ID}`;
      }

      const aspect_ratio = await getImageAspectRatio(artworkImageAsset.uri);
      const image_format = getRatioString(aspect_ratio);

      const artwork = createUploadedArtworkData(
        {
          ...artworkUploadData,
          price: nextPrice,
          usd_price: nextPrice,
          shouldShowPrice,
          currency: "USD",
          packaging_type: artworkUploadData.packaging_type ?? "rolled",
        },
        uploadedArtwork.$id,
        userSession.id,
        {
          role: "artist",
          designation: userSession?.categorization || null,
        } as any,
        image_format,
      );

      const fallbackAlgorithm = {
        recommendedPrice,
        priceRange: [
          Math.max(recommendedPrice * 0.6, 0),
          Math.max(recommendedPrice * 0.8, 0),
          recommendedPrice,
          recommendedPrice,
          Math.max(recommendedPrice * 1.2, 0),
        ] as [number, number, number, number, number],
        meanPrice: recommendedPrice,
      };

      const algorithmRecommendation =
        artworkUploadData?.algorithm_recommendation || fallbackAlgorithm;

      const payload = {
        artist_id: userSession.id,
        artist_review: {
          requested_price: nextPrice,
          ...(requiresJustification && {
            justification_type: justificationType,
            justification_proof_url: finalJustificationUrl,
            justification_notes: proposalReason,
          }),
        },
        meta: {
          artwork,
          algorithm_recommendation: algorithmRecommendation,
        },
      };

      const response = await createPriceReviewRequest(payload);

      if (!response?.isOk) {
        throw new Error(
          response?.message || "Unable to submit review request right now.",
        );
      }

      clearData();
      setSubmittedProposalPrice(null);

      if (response.status === "AUTO_APPROVED") {
        updateModal({
          showModal: true,
          modalType: "success",
          message: "Price approved! Your artwork is being published.",
          onDismiss: () => {
            updateModal({
              showModal: false,
              modalType: "success",
              message: "",
            });
            navigation.navigate(screenName.artworks);
          },
        });
      } else {
        updateModal({
          showModal: true,
          modalType: "success",
          message: "Review submitted. We'll notify you shortly.",
          onDismiss: () => {
            queryClient.invalidateQueries({
              queryKey: ["artist_price_reviews"],
              exact: false,
            });
            updateModal({
              showModal: false,
              modalType: "success",
              message: "",
            });
            navigation.navigate(screenName.artist.reviewHub);
          },
        });
      }
    } catch (error: any) {
      updateModal({
        showModal: true,
        modalType: "error",
        message:
          error?.message ||
          "Unable to submit price review now. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={tw`bg-white flex-1 w-full`}>
      <View
        style={[
          tw`px-5 pb-4 border-b border-neutral-200 bg-white`,
          { paddingTop: insets.top + 12 },
        ]}
      >
        <Text
          style={[tw`text-2xl font-sans-semibold`, { color: colors.black }]}
        >
          Propose New Price
        </Text>
        <Text style={tw`text-base text-neutral-500 mt-1`}>
          Adjust the baseline pricing and visibility for this specific artwork.
        </Text>
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: Math.max(insets.bottom + keyboardHeight + 72, 96),
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <PricingOverrideCard recommendedPrice={recommendedPrice} />

        <View
          style={tw`bg-white border border-neutral-200 rounded-sm p-4 mt-7`}
        >
          <Text style={tw`text-base font-sans-semibold text-neutral-700 mb-3`}>
            Target Listing Price (USD)
          </Text>
          <View
            style={tw`border border-neutral-200 rounded-sm px-3 flex-row items-center h-[50px]`}
          >
            <Text
              style={[
                tw`text-base mr-2 font-sans-regular text-center`,
                { color: colors.black },
              ]}
            >
              $
            </Text>
            <TextInput
              value={proposalPrice}
              onChangeText={(v) => {
                setProposalPrice(v);
                if (inputError) setInputError(null);
              }}
              keyboardType="numeric"
              placeholder={recommendedPricePlaceholder}
              placeholderTextColor={colors.grey}
              style={[
                tw`flex-1 font-sans-regular text-base h-full`,
                {
                  color: colors.black,
                  textAlignVertical: "center",
                  ...iosInput,
                },
              ]}
            />
          </View>

          {isPriceEntered && (
            <PriceStatusNotice
              proposedNumber={proposedNumber}
              recommendedPrice={recommendedPrice}
              autoApproveCap={autoApproveCap}
              hasAutoApprovalsRemaining={hasAutoApprovalsRemaining}
            />
          )}
        </View>

        {!isCustomPricingEligibleArtist && (
          <View
            style={tw`bg-white border border-neutral-200 rounded-sm p-4 mt-7`}
          >
            <Text style={tw`text-base font-sans-semibold text-gray-800 mb-2`}>
              Pricing Visibility
            </Text>
            <Text style={tw`text-base text-gray-500 mb-4`}>
              Control how collectors view the price of this artwork.
            </Text>

            <View style={tw`mt-1`}>
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
                value={shouldShowPrice}
                handleSetValue={(item) => {
                  const nextValue = item.value as "Yes" | "No";
                  setShouldShowPrice(nextValue);
                  updateArtworkUploadData("shouldShowPrice", nextValue);
                  if (inputError) setInputError(null);
                }}
                dropdownPosition="auto"
              />
            </View>
          </View>
        )}

        {requiresJustification && (
          <JustificationSection
            justificationType={justificationType}
            proofFormat={proofFormat}
            justificationUrl={justificationUrl}
            justificationFileName={justificationFileName}
            needsProof={needsProof}
            onChangeJustificationType={(value) => {
              setJustificationType(value);
              setJustificationUrl("");
              setJustificationFileName("");
              setJustificationFileMeta(null);
              if (inputError) setInputError(null);
            }}
            onChangeProofFormat={setProofFormat}
            onChangeJustificationUrl={(value) => {
              setJustificationUrl(value);
              setJustificationFileName("");
              setJustificationFileMeta(null);
              if (inputError) setInputError(null);
            }}
            onPickProofDocument={pickProofDocument}
          />
        )}

        {requiresJustification && (
          <View
            style={[
              tw`border rounded-sm px-4 py-4 mb-2 bg-white`,
              { borderColor: colors.inputBorder },
            ]}
          >
            <Text
              style={tw`text-base font-sans-semibold text-neutral-700 mb-3`}
            >
              Contextual Notes
            </Text>
            <TextInput
              value={proposalReason}
              onChangeText={(v) => {
                setProposalReason(v);
                if (inputError) setInputError(null);
              }}
              multiline
              textAlignVertical="top"
              numberOfLines={5}
              placeholder="Help our review team understand the price change..."
              placeholderTextColor={colors.grey}
              style={[tw`text-base min-h-[110px]`, { color: colors.black }]}
            />
          </View>
        )}

        <AgreementSection
          agreementCount={agreementCount}
          priceConsent={priceConsent}
          acknowledgment={acknowledgment}
          penaltyConsent={penaltyConsent}
          onTogglePriceConsent={() => setPriceConsent((prev) => !prev)}
          onToggleAcknowledgment={() => setAcknowledgment((prev) => !prev)}
          onTogglePenaltyConsent={() => setPenaltyConsent((prev) => !prev)}
          onOpenTerms={openTerms}
        />
        {inputError && (
          <Text style={tw`text-base text-red-500 mt-2`}>{inputError}</Text>
        )}
      </ScrollView>

      <View
        style={[
          tw`px-4 pt-4 pb-3 border-t border-neutral-200 bg-white flex-row gap-3`,
          { paddingBottom: Math.max(insets.bottom + 8, 14) },
        ]}
      >
        <Pressable
          onPress={handleClose}
          style={[
            tw`rounded-sm py-3 items-center justify-center border border-neutral-300 px-5`,
            { minWidth: 90 },
          ]}
        >
          <Text style={[tw`font-sans-medium`, { color: colors.black }]}>
            Cancel
          </Text>
        </Pressable>

        <View style={tw`flex-1`}>
          <LongBlackButton
            value={
              isAutoApproveZone
                ? "Submit & Continue"
                : "Submit for Verification"
            }
            onClick={handleSubmit}
            isDisabled={!canSubmit}
            isLoading={isSubmitting}
            textStyle={tw`font-sans-semibold tracking-normal normal-case text-sm`}
          />
        </View>
      </View>
    </View>
  );
}

export default function ProposalPriceModal() {
  return <ProposalPriceModalImpl />;
}
