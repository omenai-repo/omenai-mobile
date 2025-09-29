import { gallery_logo_storage } from 'appWrite_config';
import { ID } from 'appwrite';

const uploadGalleryLogoContent = async (file: any) => {
  if (!file) return;
  const fileUploaded = await gallery_logo_storage.createFile(
    process.env.EXPO_PUBLIC_APPWRITE_GALLERY_LOGO_BUCKET_ID!,
    ID.unique(),
    file,
  );
  return fileUploaded;
};

export default uploadGalleryLogoContent;
