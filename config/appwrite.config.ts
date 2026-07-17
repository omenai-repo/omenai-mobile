export const appwriteConfig = {
  clientId: process.env.EXPO_PUBLIC_APPWRITE_CLIENT_ID,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
  editorialBucketId: process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_BUCKET_ID,
  editorialDatabaseId: process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_DATABASE_ID,
  editorialCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_COLLECTION_ID,
  promotionalBucketId: process.env.EXPO_PUBLIC_APPWRITE_PROMOTIONAL_BUCKET_ID,
  logoBucketId: process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID,
  documentationBucketId:
    process.env.EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID,
} as const;
