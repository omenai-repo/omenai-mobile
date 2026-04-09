import { ID } from "appwrite";
import { storage } from "#appWrite_config";

const uploadArtistDoc = async (file: {
  uri: string;
  name: string;
  type: string;
  size?: number;
}) => {
  const normalizedFile = {
    uri: file.uri,
    name: file.name || `artist-doc-${Date.now()}.pdf`,
    type: file.type || "application/pdf",
    size: file.size ?? 0,
  };

  const fileUploaded = await storage.createFile({
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID!,
    fileId: ID.unique(),
    file: normalizedFile as any,
  });
  return fileUploaded;
};

export default uploadArtistDoc;
