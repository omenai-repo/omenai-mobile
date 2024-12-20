import { database } from "../../../lib/editorial/controller/appwrite";

export const updateDocView = async (doc_id: string, currentViews: number) => {
  try {
    const update = await database.updateDocument(
      process.env.EXPO_PUBLIC_NEXT_PUBLIC_APPWRITE_EDITORIAL_DATABASE_ID!,
      process.env.EXPO_PUBLIC_NEXT_PUBLIC_APPWRITE_EDITORIAL_COLLECTION_ID!,
      doc_id,
      { views: currentViews + 1 }
    );
  } catch (error) {
    console.log(error);
  }
};
