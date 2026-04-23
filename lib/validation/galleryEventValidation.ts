import { z } from "zod";

const BaseEventSchema = z.object({
  gallery_id: z.string().min(1, "Gallery ID is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  cover_image: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  participating_artists: z.array(z.string()).default([]),
  featured_artworks: z.array(z.string()).default([]),
  installation_views: z.array(z.string()).optional(),
});

const LocationSchema = z.object({
  venue: z.string().min(1, "Venue name is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});

const ExhibitionSchema = BaseEventSchema.extend({
  event_type: z.literal("exhibition"),
  location: LocationSchema,
});

const ArtFairSchema = BaseEventSchema.extend({
  event_type: z.literal("art_fair"),
  location: LocationSchema,
  booth_number: z.string().optional(),
  vip_preview_date: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce.date().optional(),
  ),
});

const ViewingRoomSchema = BaseEventSchema.extend({
  event_type: z.literal("viewing_room"),
  external_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export const GalleryEventValidationSchema = z
  .discriminatedUnion("event_type", [
    ExhibitionSchema,
    ArtFairSchema,
    ViewingRoomSchema,
  ])
  .superRefine((data, ctx) => {
    if (data.end_date < data.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after the start date",
        path: ["end_date"],
      });
    }
  });

export type CreateGalleryEventPayload = z.infer<typeof GalleryEventValidationSchema>;
