import { storage } from "#config/appwrite.client";

export const getInvoiceDownloadUrl = (fileId: string) => {
  if (!fileId) return;

  const fileDownload = storage.getFileDownload({
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_INVOICE_BUCKET_ID!,
    fileId: fileId,
  });

  return fileDownload;
};
