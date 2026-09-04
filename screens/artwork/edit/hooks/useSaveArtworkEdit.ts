import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useAppStore } from "#store/app/appStore";
import { useModalStore } from "#store/account/modal/modalStore";
import { updateArtwork } from "#services/artwork/updateArtwork";
import { updateArtworkDimensions } from "#services/artwork/updateArtworkDimensions";
import {
  toCanonicalDimensionString,
  toCanonicalWeightString,
} from "#utils/artwork/utils_artworkUnits";
import { DimensionsFormState } from "../components/EditArtworkDimensions";
import { z } from "zod";

interface UseSaveArtworkEditProps {
  artID: string | null;
  dims: DimensionsFormState;
  dimUnit: DimensionUnit;
  weightUnit: WeightUnit;
  description: string;
  pricing: {
    price: number;
    usdPrice: number;
    shouldShowPrice: string;
    currency: string;
  };
  dimensionsChanged: boolean;
  pricingChanged: boolean;
  descriptionChanged: boolean;
}

export function useSaveArtworkEdit({
  artID,
  dims,
  dimUnit,
  weightUnit,
  description,
  pricing,
  dimensionsChanged,
  pricingChanged,
  descriptionChanged,
}: UseSaveArtworkEditProps) {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { userType } = useAppStore();
  const { updateModal } = useModalStore();

  const [isSaving, setIsSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = async () => {
    setShowConfirm(false);
    setIsSaving(true);
    try {
      let result;

      const dimensionSchema = z.object({
        height: z
          .string()
          .min(1, "Height is required")
          .regex(/^\d+(\.\d+)?$/, "Height must be a valid number"),
        width: z
          .string()
          .min(1, "Width is required")
          .regex(/^\d+(\.\d+)?$/, "Width must be a valid number"),
        weight: z
          .string()
          .min(1, "Weight is required")
          .regex(/^\d+(\.\d+)?$/, "Weight must be a valid number"),
      });

      if (dimensionsChanged) {
        const validationResult = dimensionSchema.safeParse(dims);
        if (!validationResult.success) {
          updateModal({
            message:
              "Width, height, and weight are required and must be valid numbers.",
            modalType: "error",
            showModal: true,
          });
          setIsSaving(false);
          return;
        }
      }

      if (userType === "artist") {
        const dimensionsFilter = {
          height: toCanonicalDimensionString(Number(dims.height), dimUnit),
          width: toCanonicalDimensionString(Number(dims.width), dimUnit),
          weight: toCanonicalWeightString(Number(dims.weight), weightUnit),
        };
        result = await updateArtworkDimensions(dimensionsFilter, artID!);
      } else {
        const filter: Record<string, any> = {};

        if (descriptionChanged) {
          filter.artwork_description = description.trim();
        }

        if (dimensionsChanged) {
          filter.dimensions = {
            height: toCanonicalDimensionString(Number(dims.height), dimUnit),
            width: toCanonicalDimensionString(Number(dims.width), dimUnit),
            weight: toCanonicalWeightString(Number(dims.weight), weightUnit),
          };
        }

        if (pricingChanged) {
          filter.pricing = {
            price: pricing.price,
            usd_price: pricing.usdPrice,
            shouldShowPrice: pricing.shouldShowPrice,
            currency: pricing.currency,
          };
        }

        result = await updateArtwork(filter, artID!);
      }

      if (!result.isOk) {
        updateModal({
          message: result.message ?? "Update failed. Please try again.",
          modalType: "error",
          showModal: true,
        });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["artwork", artID] });
      await queryClient.invalidateQueries({ queryKey: ["artworks"] });
      await queryClient.invalidateQueries({
        queryKey: ["artwork_single", artID],
      });
      await queryClient.invalidateQueries({
        queryKey: ["artworks", "galleryOrArtist", "all"],
      });

      updateModal({
        message: "Artwork updated successfully.",
        modalType: "success",
        showModal: true,
        onDismiss: () => navigation.goBack(),
      });
    } catch {
      updateModal({
        message: "An error occurred. Please try again.",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    showConfirm,
    setShowConfirm,
    handleSave,
  };
}
