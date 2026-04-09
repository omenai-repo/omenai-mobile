const uploadImage = async (file: {
  uri: string;
  name: string;
  type: string;
  size?: number;
}) => {
  const normalizedFile = {
    uri: file.uri,
    name: file.name || `artwork-${Date.now()}.jpg`,
    type: file.type || "image/jpeg",
  };

  const formData = new FormData();
  formData.append("fileId", "unique()");
  formData.append("file", normalizedFile as any);

  const res = await fetch(
    `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID}/files`,
    {
      method: "POST",
      headers: {
        "X-Appwrite-Project": process.env.EXPO_PUBLIC_APPWRITE_CLIENT_ID!,
      },
      body: formData,
    },
  );

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message || "Upload failed");
  }

  if (!json?.$id) {
    throw new Error("Upload failed: file id missing");
  }

  return json;
};

export default uploadImage;
