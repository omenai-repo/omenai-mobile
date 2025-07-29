import { gallery_logo_storage } from 'appWrite_config';
import { ImageFormat, ImageGravity } from 'appwrite';

export const getGalleryLogoFileView = (
  fileId: string,
  width: number,
  height?: number,
  format?: string,
) => {
  const fileData = gallery_logo_storage.getFilePreview(
    process.env.EXPO_PUBLIC_APPWRITE_GALLERY_LOGO_BUCKET_ID!,
    fileId,

    width, // width, will be resized using this value.
    height ? height : 0, // height, ignored when 0
    ImageGravity.Center, // crop center
    90, // slight compression
    0, // border width
    'FFFFFF', // border color
    0, // border radius
    1, // full opacity
    0, // no rotation
    'FFFFFF', // background color
    ImageFormat.Jpeg,
  );

  // const fileData = gallery_logo_storage.getFileView(
  //   process.env.EXPO_PUBLIC_APPWRITE_GALLERY_LOGO_BUCKET_ID!,
  //   fileId,
  // );

  return fileData;
};
