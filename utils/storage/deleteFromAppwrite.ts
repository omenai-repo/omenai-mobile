type DeleteFromAppwriteOptions = {
  bucketId: string;
  fileId: string;
  errorMessage?: string;
};

export async function deleteFromAppwrite({
  bucketId,
  fileId,
  errorMessage = "Delete failed",
}: DeleteFromAppwriteOptions) {
  if (!fileId) {
    throw new Error("File id is missing.");
  }

  const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.EXPO_PUBLIC_APPWRITE_CLIENT_ID;
  if (!endpoint || !projectId || !bucketId) {
    throw new Error("Delete configuration is missing.");
  }

  const res = await fetch(
    `${endpoint}/storage/buckets/${bucketId}/files/${encodeURIComponent(fileId)}`,
    {
      method: "DELETE",
      headers: {
        "X-Appwrite-Project": projectId,
      },
    },
  );

  if (!res.ok) {
    let message = errorMessage;
    try {
      const json = await res.json();
      message = json?.message || errorMessage;
    } catch {
      // ignore JSON parse failure
    }
    throw new Error(message);
  }

  return true;
}
