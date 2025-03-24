import { documentation_storage } from "appWrite";
import { ID } from "react-native-appwrite";

const uploadArtistDoc = async (file: any) => {
  if (!file) return;
  const fileUploaded = await documentation_storage.createFile(
    process.env.EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID!,
    ID.unique(),
    file
  );
  return fileUploaded;
};

export default uploadArtistDoc;
