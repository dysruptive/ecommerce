"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

export interface UploadedImage {
  id?: string; // present for existing DB images
  url: string;
  altText?: string;
  position: number;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  folder: string; // Cloudinary folder, e.g. "stores/fresh-mart/products"
  maxImages?: number;
}

export function ImageUpload({
  images,
  onChange,
  folder,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      setError(`Maximum ${maxImages} images allowed.`);
      return;
    }

    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    setError(null);

    try {
      const results = await Promise.all(
        toUpload.map((file) => uploadToCloudinary(file, folder)),
      );
      const newImages: UploadedImage[] = results.map((r, i) => ({
        url: r.secure_url,
        position: images.length + i,
      }));
      onChange([...images, ...newImages]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    const updated = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, position: i }));
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, idx) => (
            <div key={img.id ?? img.url} className="relative">
              <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                <Image
                  src={img.url}
                  alt={img.altText ?? `Image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {images.length < maxImages && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-md border border-dashed px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {images.length === 0 ? "Upload images" : "Add more"}
                <span className="text-xs opacity-60">
                  ({images.length}/{maxImages})
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
