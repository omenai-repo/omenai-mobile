import { Client, Storage, TablesDB } from "appwrite";


const client = new Client();

if (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
  client
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_CLIENT_ID!);
}

// const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;

export const storage = new Storage(client);

export const editorial_database = new TablesDB(client);
