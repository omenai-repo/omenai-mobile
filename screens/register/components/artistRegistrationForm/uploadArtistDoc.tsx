import { uploadToAppwrite } from "#utils/uploadToAppwrite";

const uploadArtistDoc = async (file: {
  uri: string;
  name: string;
  type: string;
  size?: number;
}) => {
  return uploadToAppwrite({
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID!,
    file,
    fallbackName: `artist-doc-${Date.now()}.pdf`,
    fallbackType: "application/pdf",
    errorMessage: "Document upload failed",
  });
};

export default uploadArtistDoc;
