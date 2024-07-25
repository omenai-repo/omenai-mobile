import { Client, Storage } from 'react-native-appwrite';
const client = new Client();
const endpoint = "https://cloud.appwrite.io/v1";

client
  .setEndpoint(endpoint)
  .setProject(process.env.APPWRITE_CLIENT_ID!);

export const storage = new Storage(client);

const promotional_client = new Client();

promotional_client
  .setEndpoint(endpoint)
  .setProject(process.env.PUBLIC_APPWRITE_PROMOTIONAL_CLIENT_ID!);

export const promotional_storage = new Storage(promotional_client);