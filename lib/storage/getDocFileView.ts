import { storage } from "#config/appwrite.client";

export const getDocFileView = (fileId: string) => {
  const fileData = storage.getFileView({
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID!,
    fileId: fileId,
  });

  return fileData;
};
