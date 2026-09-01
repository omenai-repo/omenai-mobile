import { Text, View, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import GalleryEditPricing from "./components/GalleryEditPricing";
import EditArtworkDescription from "./components/EditArtworkDescription";
import EditArtworkDimensions from "./components/EditArtworkDimensions";
import { useSaveArtworkEdit } from "./hooks/useSaveArtworkEdit";
import { useArtworkEditForm } from "./hooks/useArtworkEditForm";
import EditArtworkLoader from "./components/EditArtworkLoader";
import MarkAsSoldSection from "./components/MarkAsSoldSection";
import ScrollWrapper from "#components/general/ScrollWrapper";
import LongBlackButton from "#components/buttons/LongBlackButton";
import ArtistPricingCard from "./components/ArtistPricingCard";
import ConfirmationModal from "#components/modal/ConfirmationModal";
import DeleteArtworkSection from "./components/DeleteArtworkSection";
import ConfirmSaveArtworkModal from "./components/ConfirmSaveArtworkModal";
import { useAppStore } from "#store/app/appStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchsingleArtwork } from "#services/artwork/fetchSingleArtwork";
import tw from "twrnc";

export default function EditArtwork() {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const queryClient = useQueryClient();
  const { userType, userSession } = useAppStore();
  const insets = useSafeAreaInsets();

  const [artID, setArtID] = useState<string | null>(null);

  useEffect(() => {
    const { art_id } = route.params as { art_id: string };
    setArtID(art_id);
  }, []);

  const { data: artwork, isLoading } = useQuery({
    queryKey: ["artwork_single", artID],
    queryFn: async () => {
      if (!artID) return null;
      const res = await fetchsingleArtwork(artID);
      if (!res?.isOk) return null;
      return res.body?.data ?? res.body;
    },
    enabled: !!artID,
    staleTime: 30_000,
  });

  const {
    initialised,
    description,
    setDescription,
    dimUnit,
    setDimUnit,
    weightUnit,
    setWeightUnit,
    dims,
    dimErrors,
    pricing,
    pricingErrors,
    setPricingErrors,
    proposedPrice,
    setProposedPrice,
    isReevaluating,
    canSave,
    canReevaluate,
    needsReevaluation,
    handleDimChange,
    handlePricingChange,
    handleReevaluate,
    dimensionsChanged,
    pricingChanged,
    descriptionChanged,
  } = useArtworkEditForm(artwork, userType, userSession);

  const { isSaving, showConfirm, setShowConfirm, handleSave } =
    useSaveArtworkEdit({
      artID,
      dims,
      dimUnit,
      weightUnit,
      description,
      pricing,
      dimensionsChanged,
      pricingChanged,
      descriptionChanged,
    });

  const handleActionSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["artwork", artID],
    });
    await queryClient.invalidateQueries({
      queryKey: ["artworks"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["artwork_single", artID],
    });
    await queryClient.invalidateQueries({
      queryKey: ["artworks", "galleryOrArtist", "all"],
    });
    navigation.goBack();
  };

  if (isLoading || !initialised) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <BackHeaderTitle title="Edit Artwork" />
        <EditArtworkLoader />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`bg-white border-b border-neutral-200`}>
        <BackHeaderTitle title="Edit Artwork" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <ScrollWrapper style={tw`flex-1`}>
          <View style={tw`px-4 pt-5 pb-28 gap-5`}>
            {userType === "gallery" && (
              <EditArtworkDescription
                description={description}
                onChangeText={setDescription}
              />
            )}

            <EditArtworkDimensions
              dims={dims}
              errors={dimErrors}
              dimUnit={dimUnit}
              weightUnit={weightUnit}
              onFieldChange={handleDimChange}
              onDimUnitChange={(u) => {
                setDimUnit(u);
                setProposedPrice(null);
              }}
              onWeightUnitChange={(u) => {
                setWeightUnit(u);
                setProposedPrice(null);
              }}
            />

            {userType === "artist" && (
              <View style={tw`gap-3`}>
                <ArtistPricingCard
                  currentPricing={artwork?.pricing}
                  proposedPrice={proposedPrice}
                />
              </View>
            )}

            {userType === "gallery" && (
              <GalleryEditPricing
                pricing={pricing}
                onPricingChange={handlePricingChange}
                formErrors={pricingErrors}
                setFormErrors={setPricingErrors}
              />
            )}

            {userType === "gallery" && (
              <MarkAsSoldSection
                art_id={artID!}
                availability={artwork?.availability ?? true}
                onMarkAsSoldSuccess={handleActionSuccess}
              />
            )}

            {userType === "gallery" && (
              <DeleteArtworkSection
                art_id={artID!}
                onDeleteSuccess={handleActionSuccess}
              />
            )}
          </View>
        </ScrollWrapper>
      </KeyboardAvoidingView>

      <View
        style={[
          tw`absolute bottom-0 left-0 right-0 bg-white px-4 pt-3`,
          {
            paddingBottom: insets.bottom + 12,
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 12,
          },
        ]}
      >
        {needsReevaluation ? (
          <LongBlackButton
            value="Re-evaluate Price"
            onClick={handleReevaluate}
            isDisabled={!canReevaluate || isReevaluating}
            isLoading={isReevaluating}
          />
        ) : (
          <LongBlackButton
            value="Save Changes"
            onClick={() => setShowConfirm(true)}
            isDisabled={!canSave}
            isLoading={isSaving}
          />
        )}
      </View>

      <ConfirmationModal
        isVisible={showConfirm}
        onClose={() => setShowConfirm(false)}
        child={
          <ConfirmSaveArtworkModal
            onConfirm={handleSave}
            onCancel={() => setShowConfirm(false)}
            canSave={canSave}
            isSaving={isSaving}
          />
        }
      />
    </View>
  );
}
