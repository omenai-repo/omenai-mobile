import { storage, ID } from "../../../lib/editorial/controller/appwrite";

export const uploadImage = async (file: File | undefined) => {
  if (file === undefined) return;

  const imageUploadPromise = await storage
    .createFile(
      process.env.EXPO_PUBLIC_NEXT_PUBLIC_APPWRITE_EDITORIAL_BUCKET_ID!,
      ID.unique(),
      file
    )
    .then(
      function (response) {
        return response;
      },
      function (error) {
        console.log(error); // Failure
      }
    );

  return imageUploadPromise;
};
