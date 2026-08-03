import { uploadToAppwrite } from "#utils/storage/uploadToAppwrite";

export async function uploadLogo(file: {
  uri: string;
  name: string;
  type: string;
  size?: number;
}) {
  return uploadToAppwrite({
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
    file,
    fallbackName: `logo-${Date.now()}.jpg`,
    fallbackType: "image/jpeg",
    errorMessage: "Logo upload failed",
  });
}

export default uploadLogo;
