export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

/**
 * Upload a file directly to Cloudinary from the browser using an unsigned preset.
 * Returns the secure URL on success.
 */
export async function uploadToCloudinary(
  file: File,
  folder: string,
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: { message?: string } }).error?.message ??
        "Failed to upload image.",
    );
  }

  return response.json() as Promise<CloudinaryUploadResult>;
}

/**
 * Append Cloudinary URL transformation params for responsive display.
 * Inserts transformation string after /upload/ in the URL.
 */
export function getOptimizedUrl(
  url: string,
  options: { width?: number; height?: number; crop?: string } = {},
): string {
  const { width = 400, height = 400, crop = "fill" } = options;
  return url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_${crop},q_auto,f_auto/`,
  );
}
