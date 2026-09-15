import * as SecureStore from "expo-secure-store";

const ENCRYPTION_KEY_STORE = "biometric_enc_key_v1";
const IV_LENGTH = 12;

function bufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString("base64");
}

function base64ToBuffer(base64: string): ArrayBuffer {
  return Buffer.from(base64, "base64").buffer as ArrayBuffer;
}

async function getOrCreateEncryptionKey(): Promise<CryptoKey> {
  const stored = await SecureStore.getItemAsync(ENCRYPTION_KEY_STORE);

  if (stored) {
    return crypto.subtle.importKey(
      "raw",
      base64ToBuffer(stored),
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"],
    );
  }

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );

  const raw = await crypto.subtle.exportKey("raw", key);
  await SecureStore.setItemAsync(ENCRYPTION_KEY_STORE, bufferToBase64(raw));

  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptCredential(plaintext: string): Promise<string> {
  const key = await getOrCreateEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );

  const combined = new Uint8Array(IV_LENGTH + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), IV_LENGTH);

  return bufferToBase64(combined.buffer);
}

export async function decryptCredential(
  encryptedBase64: string,
): Promise<string | null> {
  try {
    const key = await getOrCreateEncryptionKey();
    const combined = new Uint8Array(base64ToBuffer(encryptedBase64));

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: combined.slice(0, IV_LENGTH) },
      key,
      combined.slice(IV_LENGTH),
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
}
