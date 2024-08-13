import { promotional_storage } from "../../appWrite";

export const getGalleryLogoFileView = (
  fileId: string,
  width: number,
  height?: number,
  format?: string
) => {
  const fileData = promotional_storage.getFilePreview(
    process.env.PUBLIC_APPWRITE_GALLERY_LOGO_BUCKET_ID!,
    fileId,

    width, // width, will be resized using this value.
    height ? height : 0, // height, ignored when 0
    "center", // crop center
    90, // slight compression
    0, // border width
    "FFFFFF", // border color
    0, // border radius
    1, // full opacity
    0, // no rotation
    "FFFFFF", // background color
    format ? format : "webp"
  );

  return fileData.href;
};
