import { editorial_database } from 'appWrite_config';

export async function listEditorials() {
  try {
    const response = editorial_database.listRows({
      databaseId: process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_DATABASE_ID!,
      tableId: process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_COLLECTION_ID!,
    });

    const result = (await response).rows;

    return { isOk: true, data: result };
  } catch (error) {
    return {
      isOk: false,
      message: 'Something went wrong, please contact IT team',
    };
  }
}
