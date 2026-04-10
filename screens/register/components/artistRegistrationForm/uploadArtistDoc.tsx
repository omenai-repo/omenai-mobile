const uploadArtistDoc = async (file: {
  uri: string;
  name: string;
  type: string;
  size?: number;
}) => {
  if (!file?.uri) {
    throw new Error("Document file path is missing.");
  }

  const normalizedFile = {
    uri: file.uri,
    name: file.name || `artist-doc-${Date.now()}.pdf`,
    type: file.type || "application/pdf",
  };

  const formData = new FormData();
  formData.append("fileId", "unique()");
  formData.append("file", normalizedFile as any);

  const res = await fetch(
    `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID}/files`,
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
    throw new Error(json?.message || "Document upload failed");
  }

  if (!json?.$id) {
    throw new Error("Document upload failed: file id missing");
  }

  return json;
};

export default uploadArtistDoc;
