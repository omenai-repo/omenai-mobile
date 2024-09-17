import { ImageFormat, ImageGravity } from "react-native-appwrite";
import { storage } from "../../appWrite";

export const getImageFileView = (
  fileId: string,
  width: number,
  height?: number,
  format?: string
) => {
  const fileData = storage.getFilePreview(
    process.env.APPWRITE_BUCKET_ID,
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
    ImageFormat.Jpeg || ImageFormat.Png || ImageFormat.Jpg || ImageFormat.Webp
  );

  return fileData.href;
};
