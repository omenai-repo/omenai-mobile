import { ImageFormat, ImageGravity } from "react-native-appwrite";
import { promotional_storage } from "../../appWrite";

export const getPromotionalFileView = (
  fileId: string,
  width: number,
  height?: number,
  format?: string
) => {
  const fileData = promotional_storage.getFilePreview(
<<<<<<< HEAD
    process.env.EXPO_PUBLIC_APPWRITE_PROMOTIONAL_BUCKET_ID!,
=======
    process.env.EXPO_PUBLIC_PUBLIC_APPWRITE_PROMOTIONAL_BUCKET_ID!,
>>>>>>> 176ec83 (change to updated env names in files)
    fileId,

    width, // width, will be resized using this value.
    height ? height : 0, // height, ignored when 0
    ImageGravity.Center, // crop center
    90, // slight compression
    0, // border width
    "FFFFFF", // border color
    0, // border radius
    1, // full opacity
    0, // no rotation
    "FFFFFF", // background color
    ImageFormat.Jpeg
  );

  return fileData.href;
};
