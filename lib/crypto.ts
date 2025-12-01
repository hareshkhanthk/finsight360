const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

async function getKey() {
  const secret = process.env.FINSIGHT_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error("FINSIGHT_ENCRYPTION_KEY is required");
  }
  const baseKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret.padEnd(32).slice(0, 32)),
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );
  return baseKey;
}

export async function encryptJson(data: unknown): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = textEncoder.encode(JSON.stringify(data));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  const buff = new Uint8Array(cipher);
  const result = new Uint8Array(iv.length + buff.length);
  result.set(iv, 0);
  result.set(buff, iv.length);
  return Buffer.from(result).toString("base64");
}

export async function decryptJson<T>(cipherText: string): Promise<T> {
  const key = await getKey();
  const data = Buffer.from(cipherText, "base64");
  const iv = data.slice(0, 12);
  const cipher = data.slice(12);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipher
  );
  return JSON.parse(textDecoder.decode(plain)) as T;
}
