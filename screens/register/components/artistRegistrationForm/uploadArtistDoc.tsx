const uploadArtistDoc = async (file: { uri: string; name: string; type: string }) => {
  const formData = new FormData();

  formData.append('fileId', 'unique()'); // Appwrite will auto-generate an ID
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as any); // TS expects a `File`, so we cast

  const res = await fetch(
    `https://cloud.appwrite.io/v1/storage/buckets/${process.env.EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID}/files`,
    {
      method: 'POST',
      headers: {
        'X-Appwrite-Project': process.env.EXPO_PUBLIC_APPWRITE_CLIENT_ID!,
        'X-Appwrite-Key': process.env.EXPO_PUBLIC_APPWRITE_UPLOAD_KEY!,
      },
      body: formData,
    },
  );

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Upload failed');

  return json; // file metadata
};

export default uploadArtistDoc;
