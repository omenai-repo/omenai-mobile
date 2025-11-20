import { storage } from 'appWrite_config';
import { ID } from 'appwrite';

const uploadGalleryLogoContent = async (file: any) => {
  if (!file) return;
  const fileUploaded = await storage.createFile({
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
    fileId: ID.unique(),
    file: file,
  });
  return fileUploaded;
};

export default uploadGalleryLogoContent;
