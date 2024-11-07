import { database } from "../../../lib/editorial/controller/appwrite";
import { getEditorialData } from "./getEditorialData";
import { getPromiseResolvedEditorialData } from "./getPromisedResolvedEditorialData";

export const listEditorials = async () => {
  try {
    let promise = await database.listDocuments(
      process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_DATABASE_ID!,
      process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_COLLECTION_ID!
    );
    // console.log(promise)
    // const articles = await getEditorialData(promise);
    // const resolvedArticles = await getPromiseResolvedEditorialData(articles);
    return promise.documents;
  } catch (error) {
    console.log(error);
  }
};
