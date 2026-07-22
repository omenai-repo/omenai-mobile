import { format } from "date-fns";
import { uploadToAppwrite } from "#utils/uploadToAppwrite";
import type { GalleryEventType } from "#services/events/events.service";

export type PickedAsset = { uri: string; mimeType?: string; name: string };

export const EVENT_TYPES: Readonly<{ id: GalleryEventType; label: string }[]> = [
  { id: "exhibition", label: "Gallery Exhibition" },
  { id: "art_fair", label: "Art Fair Presentation" },
  { id: "viewing_room", label: "Digital Viewing Room" },
];

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatYmdLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseYmdLocal(ymd: string): Date | null {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, mo, da] = ymd.split("-").map(Number);
  const date = new Date(y, mo - 1, da);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== mo - 1 ||
    date.getDate() !== da
  ) {
    return null;
  }
  return date;
}

export function formatYmdForDisplay(ymd: string): string {
  const d = parseYmdLocal(ymd);
  return d ? format(d, "MMM d, yyyy") : "";
}

/** Multiline input style constants for the form. */
export const formMultilineInputStyle = [
  {
    width: "100%" as const,
    borderRadius: 2,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderColor: "#D4D4D4",
    backgroundColor: "#FAFAFA",
    color: "#1a1a2e",
    minHeight: 120,
    textAlignVertical: "top" as const,
  },
];

export async function uploadEventAssets(
  coverAsset: PickedAsset,
  installationAssets: PickedAsset[],
  bucketId: string,
): Promise<{ coverId: string; installationIds: string[] }> {
  const coverUpload = await uploadToAppwrite({
    bucketId,
    file: {
      uri: coverAsset.uri,
      name: coverAsset.name,
      type: coverAsset.mimeType || "image/jpeg",
    },
    fallbackName: coverAsset.name,
    fallbackType: coverAsset.mimeType || "image/jpeg",
    errorMessage: "Cover image upload failed",
  });

  const installationUploads = await Promise.all(
    installationAssets.map((asset) =>
      uploadToAppwrite({
        bucketId,
        file: {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || "image/jpeg",
        },
        fallbackName: asset.name,
        fallbackType: asset.mimeType || "image/jpeg",
        errorMessage: "Installation image upload failed",
      }),
    ),
  );

  return {
    coverId: coverUpload.$id,
    installationIds: installationUploads.map((up) => up.$id),
  };
}
