import { Client, Storage } from 'react-native-appwrite';
const client = new Client();
const endpoint = "https://cloud.appwrite.io/v1";

client
  .setEndpoint(endpoint)
  .setProject("655231c3469bf1ef8d8f");

export const storage = new Storage(client);

const promotional_client = new Client();

promotional_client
  .setEndpoint(endpoint)
  .setProject("66a0e9130033484bb1c5");

export const promotional_storage = new Storage(promotional_client);

// Gallery logo upload
const gallery_logo_client = new Client();

gallery_logo_client
  .setEndpoint(endpoint)
  .setProject("66aa198b0038ad614178");

export const gallery_logo_storage = new Storage(gallery_logo_client);