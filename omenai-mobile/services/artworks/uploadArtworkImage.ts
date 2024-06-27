import { storage } from "../../appWrite";
import { ID } from "react-native-appwrite";

const uploadImage = async (file: any) => {
  if (!file) return;
  const fileUploaded = await storage.createFile(
    process.env.APPWRITE_BUCKET_ID!,
    ID.unique(),
    file
  );
  return fileUploaded;
};

export default uploadImage;
