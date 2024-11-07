import { promotional_storage } from "../../appWrite";

export const getPromotionalFileView = (
  fileId: string,
  width: number,
  height?: number,
  format?: string
) => {
  const fileData = promotional_storage.getFilePreview(
    process.env.EXPO_PUBLIC_APPWRITE_PROMOTIONAL_BUCKET_ID!,
    fileId,

    width, // width, will be resized using this value.
    height ? height : 0, // height, ignored when 0
  );

  return fileData.href;
};
