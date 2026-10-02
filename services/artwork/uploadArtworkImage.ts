import { uploadToAppwrite } from "#utils/storage/uploadToAppwrite";

const uploadImage = async (file: {
  uri: string;
  name: string;
  type: string;
  size?: number;
}) => {
  return uploadToAppwrite({
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
    file,
    fallbackName: `artwork-${Date.now()}.jpg`,
    fallbackType: "image/jpeg",
    errorMessage: "Upload failed",
  });
};

export default uploadImage;
