import { uploadToAppwrite } from "#utils/uploadToAppwrite";

const uploadGalleryLogoContent = async (file: any) => {
  if (!file) return;

  return uploadToAppwrite({
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
    file,
    fallbackName: `logo-${Date.now()}.jpg`,
    fallbackType: "image/jpeg",
    errorMessage: "Logo upload failed",
  });
};

export default uploadGalleryLogoContent;
