import { promotional_storage } from "../../appWrite";

export const getPromotionalFileView = (
  fileId: string,
  width: number,
  height?: number,
  format?: string
) => {
  const fileData = promotional_storage.getFilePreview(
    "66a0e9b3001b6f875e63",
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
