import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import HeaderIndicator from "./components/HeaderIndicator";
import ArtworkDetails from "./components/ArtworkDetails";
import ArtworkDimensions from "./components/ArtworkDimensions";
import ArtworkShipping from "./components/ArtworkShipping";
import ArtistDetails from "./components/ArtistDetails";
import Pricing from "./components/Pricing";
import UploadImage from "./components/UploadImage";
import { uploadArtworkStore } from "#store/gallery/uploadArtworkStore";
import uploadImage from "#services/artworks/uploadArtworkImage";
import { createUploadedArtworkData } from "#utils/utils_createUploadedArtworkData";
import {
  getImageAspectRatio,
  getRatioString,
} from "#utils/utils_getImageAspectRatio";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { uploadArtworkData } from "#services/artworks/uploadArtworkData";
import SuccessScreen from "./components/SuccessScreen";
import { useModalStore } from "#store/modal/modalStore";
import UploadingScreen from "./components/UploadingScreen";
import UploadArtworkSkeleton from "#components/skeleton/UploadArtworkSkeleton";
import { useAppStore } from "#store/app/appStore";
import LockScreen from "#screens/galleryArtworksListing/components/LockScreen";
import ScrollWrapper from "#components/general/ScrollWrapper";
import ArtworkPriceReviewScreen from "./components/ArtworkPriceReviewScreen";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccountID } from "#services/stripe/getAccountID";
import { checkIsStripeOnboarded } from "#services/stripe/checkIsStripeOnboarded";
import { retrieveSubscriptionData } from "#services/subscriptions/retrieveSubscriptionData";
import NoSubscriptionBlock from "#screens/galleryArtworksListing/components/NoSubscriptionBlock";
import { useHighRiskFeatureFlag } from "#hooks/useFeatureFlag";
import UploadBlocker from "#components/blockers/upload/UploadBlocker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Analytics } from "#utils/analytics";

export default function UploadArtwork() {
  const insets = useSafeAreaInsets();
  const { userSession, userType } = useAppStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLockScreen, setShowLockScreen] = useState(false);
  const [shouldPreCheck, setShouldPreCheck] = useState(userType === "gallery");
  const queryClient = useQueryClient();

  const {
    activeIndex,
    setActiveIndex,
    artworkUploadData,
    image,
    isUploaded,
    setIsUploaded,
    clearData,
  } = uploadArtworkStore();
  const { updateModal } = useModalStore();
  const normalizedCategorization = userSession?.categorization?.trim().toLowerCase();
  const isCustomPricingEligibleArtist = [
    "emerging",
    "early mid-career",
  ].includes(normalizedCategorization || "");
  const hasArtistCategorization = Boolean(normalizedCategorization);
  const shouldUseArtistReviewFlow =
    userType === "artist" && isCustomPricingEligibleArtist;
  const shouldUseDirectPricingFlow =
    userType !== "artist" || !isCustomPricingEligibleArtist;
  const isArtistSelfPriced = userType === "artist" && !isCustomPricingEligibleArtist;

  useEffect(() => {
    return () => {
      clearData();
    };
  }, [clearData]);

  useEffect(() => {
    if (userType === "gallery") {
      setShouldPreCheck(true);
    } else if (userType === "artist") {
      setShouldPreCheck(false);
      const shouldLock = !userSession.artist_verified || !userSession.verified;
      setShowLockScreen(shouldLock);
    }
  }, [userType, userSession]);

  const { data: isConfirmed, isLoading: loadGalleryCheck } = useQuery({
    queryKey: ["upload_precheck", shouldPreCheck],
    queryFn: async () => {
      try {
        if (userSession === undefined) {
          updateModal({
            message: "User not authenticated",
            modalType: "error",
            showModal: true,
          });
        }

        // Fetch account ID first, as it's required for the next call
        const acc = await getAccountID(userSession?.id);
        if (!acc?.isOk) {
          updateModal({
            message: "Something went wrong, Please refresh the page",
            modalType: "error",
            showModal: true,
          });
        }

        // Start retrieving subscription data while fetching Stripe onboarding status
        const [response, sub_check] = await Promise.all([
          checkIsStripeOnboarded(acc?.data.connected_account_id), // Dependent on account ID
          retrieveSubscriptionData(userSession?.id), // Independent
        ]);

        if (!response?.isOk || !sub_check?.isOk) {
          updateModal({
            message: "Something went wrong, Please refresh the page",
            modalType: "error",
            showModal: true,
          });
        }

        return {
          isSubmitted: response?.details_submitted,
          id: acc?.data.connected_account_id,
          isSubActive: sub_check?.data?.status === "active",
          plan: sub_check?.data?.plan_details?.type || sub_check?.plan,
        };
      } catch (error: any) {
        updateModal({
          message: error.message,
          modalType: "error",
          showModal: true,
        });
      }
    },
    enabled: shouldPreCheck,
    refetchOnWindowFocus: false,
  });

  const handleArtworkUpload = async () => {
    let userId = "";
    try {
      setIsLoading(true);

      let session = await utils_getAsyncData("userSession");
      if (session.value) {
        userId = JSON.parse(session.value).id;
      } else {
        return;
      }

      const imageparams = {
        name: image.assets[0].fileName,
        uri: image.assets[0].uri,
        type: image.assets[0].mimeType,
      };
      const fileUploaded = await uploadImage(imageparams);
      if (fileUploaded) {
        let file: { bucketId: string; fileId: string } = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };

        const aspect_ratio = await getImageAspectRatio(imageparams.uri);
        const image_format = getRatioString(aspect_ratio);

        const data = createUploadedArtworkData(
          artworkUploadData,
          file.fileId,
          userId,
          {
            role: userType === "artist" ? "artist" : "gallery",
            designation: null,
          },
          image_format,
        );
        const upload_response = await uploadArtworkData(data);
        if (upload_response.isOk) {
          //display success screen
          queryClient.invalidateQueries({
            queryKey: ["artworks", "galleryOrArtist", "all"],
          });
          queryClient.invalidateQueries({
            queryKey: ["artworks", userSession?.id, userType],
          });
          Analytics.track("artwork_uploaded", {
            role: userType,
            file_id: file.fileId,
            user_id: userId,
          });
          setIsUploaded(true);
        } else {
          //toast error
          if (upload_response?.status && upload_response.status >= 500) {
            Analytics.track("artwork_upload_failed", {
              role: userType,
              user_id: userId,
              message: upload_response.body,
              error: (upload_response as any).error,
              status: upload_response.status,
            });
          }
          updateModal({
            message: upload_response.body?.message,
            modalType: "error",
            showModal: true,
          });
        }
      } else {
        //toast something
        updateModal({
          message: "Error uploading artwork",
          modalType: "error",
          showModal: true,
        });
      }
    } catch (e: any) {
      Analytics.track("artwork_upload_failed", {
        message: "Error uploading artwork",
        error: e,
        role: userType,
        user_id: userId,
      });
      updateModal({
        message:
          e?.message || e?.response?.data?.message || "Error uploading artwork",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFromImageStep = async () => {
    try {
      if (userType === "gallery") {
        await handleArtworkUpload();
      } else {
        setActiveIndex(activeIndex + 1);
      }
    } catch {
      updateModal({
        message: "Error during upload. Please try again.",
        modalType: "error",
        showModal: true,
      });
    }
  };

  const imageStepButtonLabel =
    userType === "gallery"
      ? "Proceed"
      : isCustomPricingEligibleArtist
        ? "Get price quote"
        : "Proceed";

  const components = isArtistSelfPriced
    ? [
        <ArtworkDetails key="artwork-details" />,
        <ArtworkDimensions key="artwork-dimensions" />,
        <ArtworkShipping key="artwork-shipping" />,
        <ArtistDetails key="artist-details" />,
        <UploadImage
          key="upload-image"
          handleUpload={handleUploadFromImageStep}
          primaryButtonLabel={imageStepButtonLabel}
        />,
        <Pricing
          key="pricing"
          plan={isConfirmed?.plan}
          onFinalProceed={handleArtworkUpload}
        />,
      ]
    : [
        <ArtworkDetails key="artwork-details" />,
        <ArtworkDimensions key="artwork-dimensions" />,
        <ArtworkShipping key="artwork-shipping" />,
        ...(shouldUseDirectPricingFlow
          ? [<Pricing key="pricing" plan={isConfirmed?.plan} />]
          : []),
        <ArtistDetails key="artist-details" />,
        <UploadImage
          key="upload-image"
          handleUpload={handleUploadFromImageStep}
          primaryButtonLabel={imageStepButtonLabel}
        />,
        ...(shouldUseArtistReviewFlow
          ? [
              <ArtworkPriceReviewScreen
                key="price-review"
                onConfirm={handleArtworkUpload}
              />,
            ]
          : []),
      ];

  const shouldShowVerificationBlock =
    !userSession?.gallery_verified && !isConfirmed?.isSubActive;
  const shouldShowSubscriptionBlock =
    userSession?.gallery_verified && !isConfirmed?.isSubActive;
  const shouldShowMixedVerification =
    !userSession?.gallery_verified && isConfirmed?.isSubActive;
  const canUpload = userSession?.gallery_verified && isConfirmed?.isSubActive;

  const renderUploadContent = () => (
    <View style={{ paddingBottom: insets.bottom + 16, flex: 1 }}>
      <HeaderIndicator
        shouldUseArtistReviewFlow={shouldUseArtistReviewFlow}
        isArtistSelfPriced={isArtistSelfPriced}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollWrapper
          key={`scroll-${activeIndex}`}
          style={styles.container}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!isLoading && !isUploaded && components[activeIndex - 1]}
          {!isLoading && isUploaded && <SuccessScreen />}
          {isLoading && <UploadingScreen />}
        </ScrollWrapper>
      </KeyboardAvoidingView>
    </View>
  );

  const shouldShowLock =
    userType === "gallery"
      ? shouldShowVerificationBlock || shouldShowMixedVerification
      : showLockScreen;

  const shouldRenderUpload =
    userType === "gallery" ? canUpload : !showLockScreen;

  const {
    value: isArtworkPriceCalculationEnabled,
    loading: isPriceFlagLoading,
  } = useHighRiskFeatureFlag("artwork_price_calculation_enabled");
  const { value: isArtworkUploadEnabled, loading: isUploadFlagLoading } =
    useHighRiskFeatureFlag("artwork_upload_enabled");

  const isPageLoading =
    (userType === "gallery" && loadGalleryCheck) ||
    (userType === "artist" && !hasArtistCategorization) ||
    isPriceFlagLoading ||
    isUploadFlagLoading;

  const isUploadDisabled =
    !isArtworkPriceCalculationEnabled || !isArtworkUploadEnabled;

  return (
    <>
      {isPageLoading && <UploadArtworkSkeleton />}
      {!isPageLoading && isUploadDisabled && (
        <UploadBlocker
          entity={userType as "artist" | "gallery"}
          message="We are currently working on some fixes and curating your upload experience."
          expiryTimestamp="2025-11-25T18:00:00Z"
        />
      )}
      {!isPageLoading && !isUploadDisabled && shouldShowLock && (
        <LockScreen name={userSession?.name} />
      )}
      {!isPageLoading &&
        !isUploadDisabled &&
        userType === "gallery" &&
        shouldShowSubscriptionBlock && <NoSubscriptionBlock />}
      {!isPageLoading &&
        !isUploadDisabled &&
        shouldRenderUpload &&
        renderUploadContent()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 8,
    paddingTop: 8,
  },
});
