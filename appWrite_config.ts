import { Client, Storage, TablesDB } from 'appwrite';
const client = new Client();
const endpoint = 'https://cloud.appwrite.io/v1';

client.setEndpoint(endpoint).setProject(process.env.EXPO_PUBLIC_APPWRITE_CLIENT_ID!);

export const storage = new Storage(client);

export const editorial_database = new TablesDB(client);
