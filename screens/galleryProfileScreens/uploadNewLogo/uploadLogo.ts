const uploadLogo = async (file: {
  uri: string;
  name: string;
  type: string;
  size?: number;
}) => {
  if (!file?.uri) {
    throw new Error("Image file path is missing.");
  }

  const normalizedFile = {
    uri: file.uri,
    name: file.name || `logo-${Date.now()}.jpg`,
    type: file.type || "image/jpeg",
  };

  const formData = new FormData();
  formData.append("fileId", "unique()");
  formData.append("file", normalizedFile as any);

  const res = await fetch(
    `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID}/files`,
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
    throw new Error(json?.message || "Logo upload failed");
  }

  if (!json?.$id) {
    throw new Error("Logo upload failed: file id missing");
  }

  return json;
};

export default uploadLogo;
