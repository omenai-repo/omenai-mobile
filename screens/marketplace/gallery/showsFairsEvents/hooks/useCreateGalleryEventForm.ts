import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { GalleryEventType } from "#services/marketplace/events/events.service";
import { createGalleryEvent } from "#services/marketplace/events/events.service";
import { useAppStore } from "#store/app/appStore";
import { useModalStore } from "#store/account/modal/modalStore";
import { appwriteConfig } from "#config/appwrite.config";
import { EVENTS_QK } from "#utils/core/queryKeys";
import {
  GalleryEventValidationSchema,
  type CreateGalleryEventPayload,
} from "#lib/validation/galleryEventValidation";
import { artist_countries_codes_currency } from "#data/artist_countries_codes_currency";
import { uploadEventAssets, type PickedAsset } from "../helpers/createEventHelpers";

const DUMMY_COVER_FOR_ZOD = "https://appwrite-pending.omenai.com/image.jpg";

export type CreateEventFormData = {
  gallery_id: string;
  event_type: GalleryEventType;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: { venue: string; city: string; country: string };
  external_url: string;
  booth_number: string;
  vip_preview_date: string;
};

function buildPayloadForValidation(
  formData: CreateEventFormData,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    gallery_id: formData.gallery_id,
    title: formData.title.trim(),
    description: formData.description.trim(),
    cover_image: DUMMY_COVER_FOR_ZOD,
    participating_artists: [],
    featured_artworks: [],
  };

  if (formData.start_date.trim()) payload.start_date = formData.start_date.trim();
  if (formData.end_date.trim()) payload.end_date = formData.end_date.trim();

  if (formData.event_type === "viewing_room") {
    payload.event_type = "viewing_room";
    payload.external_url = formData.external_url.trim();
    return payload;
  }

  payload.location = {
    venue: formData.location.venue.trim(),
    city: formData.location.city.trim(),
    country: formData.location.country.trim(),
  };

  if (formData.event_type === "exhibition") {
    payload.event_type = "exhibition";
    return payload;
  }

  payload.event_type = "art_fair";
  payload.booth_number = formData.booth_number.trim();
  if (formData.vip_preview_date.trim()) {
    payload.vip_preview_date = formData.vip_preview_date.trim();
  }
  return payload;
}

async function invalidateEventQueries(queryClient: any, galleryId: string) {
  await queryClient.invalidateQueries({ queryKey: EVENTS_QK.allShows });
  await queryClient.invalidateQueries({
    queryKey: [...EVENTS_QK.allFairsEvents("all")],
  });
  await queryClient.invalidateQueries({
    queryKey: EVENTS_QK.galleryProgramming(galleryId),
  });
}

export function useCreateGalleryEventForm(onSuccess: () => void) {
  const queryClient = useQueryClient();
  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();

  const galleryId = (userSession?.id as string) || "";

  const [formData, setFormData] = useState<CreateEventFormData>({
    gallery_id: galleryId,
    event_type: "exhibition",
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location: { venue: "", city: "", country: "United States" },
    external_url: "",
    booth_number: "",
    vip_preview_date: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, gallery_id: galleryId }));
  }, [galleryId]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPayload, setPendingPayload] =
    useState<CreateGalleryEventPayload | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const countryOptions = useMemo(
    () =>
      [...artist_countries_codes_currency]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({ label: c.name, value: c.name })),
    [],
  );

  const handleChange = useCallback((field: string, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field.startsWith("location.")) {
      const key = field.split(".")[1] as keyof CreateEventFormData["location"];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    } else if (field === "event_type") {
      setFormData((prev) => ({ ...prev, event_type: value as GalleryEventType }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  }, []);

  const onContinueToArtwork = useCallback(
    (coverAsset: PickedAsset | null) => {
      if (!coverAsset) {
        setErrors({ cover_image: "A cover image is required." });
        return;
      }

      setIsSubmitting(true);
      setErrors({});

      const raw = buildPayloadForValidation(formData);
      const validationResult = GalleryEventValidationSchema.safeParse(raw);

      if (!validationResult.success) {
        const newErrors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      setPendingPayload(validationResult.data);
      setIsModalOpen(true);
      setIsSubmitting(false);
    },
    [formData],
  );

  const executeFinalSubmission = useCallback(
    async (
      art: { featured_artworks: string[]; participating_artists: string[] },
      coverAsset: PickedAsset,
      installationAssets: PickedAsset[],
    ) => {
      if (!pendingPayload || !appwriteConfig.promotionalBucketId) {
        updateModal({
          showModal: true,
          modalType: "error",
          message: "Missing cover image or configuration.",
        });
        return;
      }

      setIsFinalizing(true);
      setIsModalOpen(false);

      try {
        const { coverId, installationIds } = await uploadEventAssets(
          coverAsset,
          installationAssets,
          appwriteConfig.promotionalBucketId,
        );

        const dbPayload = {
          ...pendingPayload,
          cover_image: coverId,
          featured_artworks: art.featured_artworks,
          participating_artists: art.participating_artists,
          ...(installationIds.length > 0
            ? { installation_views: installationIds }
            : {}),
        } as CreateGalleryEventPayload;

        const response = await createGalleryEvent(dbPayload);
        if (!response.isOk) {
          updateModal({
            showModal: true,
            modalType: "error",
            message:
              response.message ||
              "An error occurred while creating the event. Please try again.",
          });
          return;
        }

        await invalidateEventQueries(queryClient, galleryId);

        updateModal({
          showModal: true,
          modalType: "success",
          message: "Event successfully created.",
        });
        onSuccess();
      } catch (err: any) {
        updateModal({
          showModal: true,
          modalType: "error",
          message:
            err?.message ||
            err?.body?.message ||
            "An error occurred during final submission.",
        });
      } finally {
        setIsFinalizing(false);
      }
    },
    [pendingPayload, galleryId, queryClient, updateModal, onSuccess],
  );

  return {
    galleryId,
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    isModalOpen,
    setIsModalOpen,
    isFinalizing,
    countryOptions,
    handleChange,
    onContinueToArtwork,
    executeFinalSubmission,
  };
}
