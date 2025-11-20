import { rollbar } from "../../config/rollbar.config";

const uploadImage = async (file: { uri: string; name: string; type: string }) => {
  const formData = new FormData();

  formData.append("fileId", "unique()"); // Appwrite will auto-generate an ID
  formData.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as any); // TS expects a `File`, so we cast

  const url = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID}/files`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Appwrite-Project": process.env.EXPO_PUBLIC_APPWRITE_CLIENT_ID!,
      "X-Appwrite-Key": process.env.EXPO_PUBLIC_APPWRITE_UPLOAD_KEY!,
    },
    body: formData,
  });

  const json = await res.json();
  // Report 500+ errors to Rollbar
  if (res.status >= 500) {
    rollbar.error("UploadArtworkImage API 500+ error", {
      status: res.status,
      url,
      file,
      response: json,
    });
  }
  if (!res.ok) {
    rollbar.error("UploadArtworkImage API exception", { url, file, response: json });
    throw new Error(json.message || "Upload failed");
  }

  return json; // file metadata
};

export default uploadImage;
