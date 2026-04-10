type UploadFileInput = {
  uri: string;
  name?: string;
  type?: string;
};

type UploadToAppwriteOptions = {
  bucketId: string;
  file: UploadFileInput;
  fallbackName: string;
  fallbackType: string;
  errorMessage?: string;
};

export async function uploadToAppwrite({
  bucketId,
  file,
  fallbackName,
  fallbackType,
  errorMessage = "Upload failed",
}: UploadToAppwriteOptions) {
  if (!file?.uri) {
    throw new Error("File path is missing.");
  }

  const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.EXPO_PUBLIC_APPWRITE_CLIENT_ID;
  if (!endpoint || !projectId || !bucketId) {
    throw new Error("Upload configuration is missing.");
  }

  const normalizedFile = {
    uri: file.uri,
    name: file.name || fallbackName,
    type: file.type || fallbackType,
  };

  const formData = new FormData();
  formData.append("fileId", "unique()");
  formData.append("file", normalizedFile as any);

  const res = await fetch(`${endpoint}/storage/buckets/${bucketId}/files`, {
    method: "POST",
    headers: {
      "X-Appwrite-Project": projectId,
    },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message || errorMessage);
  }

  if (!json?.$id) {
    throw new Error(`${errorMessage}: file id missing`);
  }

  return json;
}
