"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImageIcon, X, Loader2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

export interface UploadedImage {
  id?: string;
  url: string;
  altText?: string;
  position: number;
}

interface ProductImagesSectionProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  folder: string;
}

export function ProductImagesSection({
  images,
  onChange,
  folder,
}: ProductImagesSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxImages = 5;

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

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  const isEmpty = images.length === 0;

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {isEmpty ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          disabled={uploading}
          className={[
            "flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors",
            isDragOver
              ? "border-[#B45309] bg-[#FFFBEB]"
              : "border-[#E5E2DB] bg-[#FAFAF9] hover:border-[#B45309] hover:bg-[#FFFBEB]",
            "disabled:cursor-not-allowed disabled:opacity-50",
          ].join(" ")}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-[#A8A29E]" />
          ) : (
            <ImageIcon className="h-8 w-8 text-[#A8A29E]" />
          )}
          <span className="text-sm font-medium text-[#78716C]">
            {uploading ? "Uploading..." : "Click to upload images"}
          </span>
          {!uploading && (
            <span className="text-xs text-[#A8A29E]">
              Up to 5 images · JPG, PNG, WEBP
            </span>
          )}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            {/* Hero image — first image larger */}
            <div className="relative">
              <div className="relative h-[200px] w-[200px] overflow-hidden rounded-xl border border-[#E5E2DB]">
                <Image
                  src={images[0].url}
                  alt={images[0].altText ?? "Product image 1"}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
                Hero
              </span>
              <button
                type="button"
                onClick={() => removeImage(0)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C1917] text-white shadow hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Remaining thumbnails */}
            {images.slice(1).map((img, idx) => {
              const realIdx = idx + 1;
              return (
                <div key={img.id ?? img.url} className="relative">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-[#E5E2DB]">
                    <Image
                      src={img.url}
                      alt={img.altText ?? `Product image ${realIdx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(realIdx)}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1C1917] text-white shadow hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#E5E2DB] px-4 py-2 text-sm text-[#78716C] transition-colors hover:border-[#B45309] hover:text-[#B45309] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add more"
              )}
              <span className="text-xs text-[#A8A29E]">
                ({images.length}/{maxImages})
              </span>
            </button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
