import { storage } from "../../../lib/editorial/controller/appwrite";

export const getImage = async (bucketId: string, fileId: string) => {
  const result = storage.getFilePreview(bucketId, fileId);
  return result;
};
