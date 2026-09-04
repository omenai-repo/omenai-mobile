import { useState, useEffect } from "react";
import { useModalStore } from "#store/account/modal/modalStore";
import { validateOrderMeasurement } from "#lib/validation/artwork/validateOrderMeasurement";
import { getArtworkPriceForArtist } from "#services/artwork/getArtworkPriceForArtist";
import { stripUnit } from "#utils/artwork/utils_artworkUnits";
import { DimensionUnit, WeightUnit } from "#types/types";
import {
  DimensionsFormState,
  DimensionsErrorsState,
} from "../components/EditArtworkDimensions";

export function useArtworkEditForm(
  artwork: any,
  userType: string | null,
  userSession: any,
) {
  const { updateModal } = useModalStore();

  const [initialised, setInitialised] = useState(false);
  const [description, setDescription] = useState("");
  const [dimUnit, setDimUnit] = useState<DimensionUnit>("in");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("lbs");
  const [dims, setDims] = useState<DimensionsFormState>({
    height: "",
    width: "",
    weight: "",
  });
  const [dimErrors, setDimErrors] = useState<DimensionsErrorsState>({
    height: "",
    width: "",
    weight: "",
  });
  const [pricing, setPricing] = useState({
    price: 0,
    usdPrice: 0,
    currency: "",
    shouldShowPrice: "",
  });
  const [pricingErrors, setPricingErrors] = useState({ price: "" });
  const [proposedPrice, setProposedPrice] = useState<{
    price: number;
    usd_price: number;
    currency: string;
  } | null>(null);

  useEffect(() => {
    if (artwork && !initialised) {
      setDescription(artwork.artwork_description ?? "");
      setDims({
        height: stripUnit(artwork.dimensions?.height),
        width: stripUnit(artwork.dimensions?.width),
        weight: stripUnit(artwork.dimensions?.weight),
      });
      if (userType === "gallery") {
        setPricing({
          price: artwork.pricing?.price || 0,
          usdPrice: artwork.pricing?.usd_price || 0,
          currency: artwork.pricing?.currency || "",
          shouldShowPrice: artwork.pricing?.shouldShowPrice || "",
        });
      }
      setInitialised(true);
    }
  }, [artwork, initialised, userType]);

  const savedDims = {
    height: stripUnit(artwork?.dimensions?.height),
    width: stripUnit(artwork?.dimensions?.width),
    weight: stripUnit(artwork?.dimensions?.weight),
  };
  const savedDescription = (artwork?.artwork_description ?? "").trim();
  const savedPricing = {
    price: artwork?.pricing?.price ?? 0,
    usdPrice: artwork?.pricing?.usd_price ?? 0,
    currency: artwork?.pricing?.currency ?? "",
    shouldShowPrice: artwork?.pricing?.shouldShowPrice ?? "",
  };

  const descriptionChanged =
    userType === "gallery" ? description.trim() !== savedDescription : false;
  const dimensionsChanged =
    dims.height !== savedDims.height ||
    dims.width !== savedDims.width ||
    dims.weight !== savedDims.weight ||
    dimUnit !== "in" ||
    weightUnit !== "lbs";
  const pricingChanged =
    pricing.price !== savedPricing.price ||
    pricing.usdPrice !== savedPricing.usdPrice ||
    pricing.currency !== savedPricing.currency ||
    pricing.shouldShowPrice !== savedPricing.shouldShowPrice;

  const hasChanges = descriptionChanged || dimensionsChanged || pricingChanged;

  const noDimErrors = Object.values(dimErrors).every((e) => e === "");
  const hasDimValues =
    dims.height !== "" && dims.width !== "" && dims.weight !== "";
  const noPricingErrors = Object.values(pricingErrors).every((e) => e === "");

  const artistCanSave = dimensionsChanged
    ? proposedPrice !== null && noDimErrors && hasDimValues
    : descriptionChanged;

  const isPricingValid = pricing.price > 0 && pricing.usdPrice > 0;
  const galleryCanSave =
    hasChanges &&
    isPricingValid &&
    noDimErrors &&
    hasDimValues &&
    noPricingErrors &&
    (artwork?.availability ?? true);

  const canSave = userType === "gallery" ? galleryCanSave : artistCanSave;

  const canReevaluate =
    noDimErrors && hasDimValues && !proposedPrice && userType === "artist";

  const needsReevaluation =
    userType === "artist" && dimensionsChanged && !proposedPrice;

  const handleDimChange = (field: keyof DimensionsFormState, value: string) => {
    setDims((prev) => ({ ...prev, [field]: value }));
    const err = validateOrderMeasurement(value);
    setDimErrors((prev) => ({
      ...prev,
      [field]: err.length > 0 ? err[0] : "",
    }));
    setProposedPrice(null);
  };

  const handlePricingChange = (fields: Partial<typeof pricing>) => {
    setPricing((prev) => ({ ...prev, ...fields }));
  };

  const [isReevaluating, setIsReevaluating] = useState(false);
  const handleReevaluate = async () => {
    if (!canReevaluate) return;

    const heightNum = Number(dims.height);
    const widthNum = Number(dims.width);
    if (
      !Number.isFinite(heightNum) ||
      !Number.isFinite(widthNum) ||
      heightNum <= 0 ||
      widthNum <= 0
    ) {
      updateModal({
        message: "Please enter valid numeric dimensions.",
        modalType: "error",
        showModal: true,
      });
      return;
    }

    setIsReevaluating(true);
    try {
      const canonicalHeight = Number.parseFloat(
        (dimUnit === "cm" ? heightNum / 2.54 : heightNum).toFixed(1),
      );
      const canonicalWidth = Number.parseFloat(
        (dimUnit === "cm" ? widthNum / 2.54 : widthNum).toFixed(1),
      );

      const result = await getArtworkPriceForArtist({
        medium: artwork?.medium,
        category: userSession?.categorization,
        height: canonicalHeight,
        width: canonicalWidth,
        currency: artwork?.pricing?.currency ?? "USD",
        artistId: userSession?.id ?? "",
      });

      if (!result.isOk || !result.data) {
        updateModal({
          message: result.message ?? "Unable to calculate price.",
          modalType: "error",
          showModal: true,
        });
        return;
      }

      setProposedPrice({
        price: result.data.price,
        usd_price: result.data.usd_price,
        currency: result.data.currency,
      });
    } catch {
      updateModal({
        message: "Unable to calculate the proposed price.",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsReevaluating(false);
    }
  };

  return {
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
  };
}
