import { Client, Databases, Storage, ID } from 'react-native-appwrite';
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_EDITORIAL_PROJECT_ID!);

export const storage = new Storage(client);
export const database = new Databases(client);

export { client, ID };