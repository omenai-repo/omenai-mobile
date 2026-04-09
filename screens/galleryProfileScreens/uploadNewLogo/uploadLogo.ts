import { ID } from "appwrite";
import { storage } from "#appWrite_config";

const uploadLogo = async (file: {
  uri: string;
  name: string;
  type: string;
  size?: number;
}) => {
  const normalizedFile = {
    uri: file.uri,
    name: file.name || `logo-${Date.now()}.jpg`,
    type: file.type || "image/jpeg",
    size: file.size ?? 0,
  };

  const fileUploaded = await storage.createFile({
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID!,
    fileId: ID.unique(),
    file: normalizedFile as any,
  });
  return fileUploaded;
};

export default uploadLogo;
