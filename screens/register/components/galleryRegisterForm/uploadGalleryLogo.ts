import { gallery_logo_storage } from "appWrite";
import { ID } from "react-native-appwrite";

const uploadGalleryLogoContent = async (file: File) => {
  if (!file) return;
  const fileUploaded = await gallery_logo_storage.createFile(
<<<<<<< HEAD
    process.env.EXPO_PUBLIC_APPWRITE_GALLERY_LOGO_BUCKET_ID!,
=======
    process.env.EXPO_PUBLIC_PUBLIC_APPWRITE_GALLERY_LOGO_BUCKET_ID!,
>>>>>>> 176ec83 (change to updated env names in files)
    ID.unique(),
    file
  );
  return fileUploaded;
};

export default uploadGalleryLogoContent;
