import { Client, Storage, TablesDB } from "appwrite";


const client = new Client();

if (process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT) {
  client
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_CLIENT_ID);
}

export const storage = new Storage(client);

export const editorial_database = new TablesDB(client);
