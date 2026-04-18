import { PinataSDK } from "pinata";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

let sdk: PinataSDK | null = null;

function getPinata(): PinataSDK {
  if (!sdk) {
    const jwt = import.meta.env.VITE_PINATA_JWT as string | undefined;
    const gateway = import.meta.env.VITE_PINATA_GATEWAY as string | undefined;
    if (!jwt) throw new Error("VITE_PINATA_JWT is not set");
    sdk = new PinataSDK({
      pinataJwt: jwt,
      pinataGateway: gateway || "gateway.pinata.cloud",
    });
  }
  return sdk;
}

export function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.has(file.type)) {
    return "Only JPEG, PNG, WebP, and GIF images are accepted.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File must be under 10 MB. Yours is ${(file.size / 1024 / 1024).toFixed(1)} MB.`;
  }
  return null;
}

export async function uploadFile(file: File): Promise<string> {
  const error = validateFile(file);
  if (error) throw new Error(error);

  const pinata = getPinata();
  const result = await pinata.upload.public.file(file);
  return result.cid;
}

export function getIpfsUrl(cid: string): string {
  const gateway = import.meta.env.VITE_PINATA_GATEWAY as string | undefined;
  const base = gateway || "https://gateway.pinata.cloud";
  return `${base}/ipfs/${cid}`;
}
