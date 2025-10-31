import { ImageFormat, ImageGravity } from 'appwrite';
import { storage } from '../../appWrite_config';

export const getImageFileView = (
  fileId: string,
  width: number,
  height?: number,
  format?: string,
) => {
  const fileData = storage.getFilePreview({
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!!,
    fileId: fileId,

    width: width, // width, will be resized using this value.
    height: height ?? 0, // height, ignored when 0
    gravity: ImageGravity.Center, // crop center
    quality: 90, // slight compression
    borderWidth: 0, // border width
    borderColor: 'FFFFFF', // border color
    borderRadius: 0, // border radius
    opacity: 1, // full opacity
    rotation: 0, // no rotation
    background: 'FFFFFF', // background color
    output: ImageFormat.Jpeg,
  });

  return fileData;
};
