import { Client, Storage } from 'react-native-appwrite';
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_CLIENT_ID!);

export const storage = new Storage(client);
