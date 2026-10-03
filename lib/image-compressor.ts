/**
 * Client-side image compression utility using HTML Canvas.
 * Compresses large camera photos from smartphones down to lightweight WebP/JPEG
 * suitable for 3G/4G low-bandwidth mobile networks in the Philippines.
 */

export interface CompressionResult {
  file: File;
  dataUrl: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  compressionRatio: number;
  width: number;
  height: number;
}

export async function compressImage(
  file: File,
  maxWidth: number = 1280,
  maxHeight: number = 1280,
  quality: number = 0.75
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith("image/")) {
      reject(new Error("Selected file is not an image."));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio-preserving dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas context"));
          return;
        }

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP or JPEG
        const outputType = "image/jpeg";
        const dataUrl = canvas.toDataURL(outputType, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas blob conversion failed"));
              return;
            }

            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: outputType,
              lastModified: Date.now(),
            });

            const originalSizeKb = Math.round(file.size / 1024);
            const compressedSizeKb = Math.round(compressedFile.size / 1024);
            const compressionRatio =
              originalSizeKb > 0
                ? Math.round(((originalSizeKb - compressedSizeKb) / originalSizeKb) * 100)
                : 0;

            resolve({
              file: compressedFile,
              dataUrl,
              originalSizeKb,
              compressedSizeKb,
              compressionRatio: Math.max(0, compressionRatio),
              width,
              height,
            });
          },
          outputType,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("Error loading image for compression"));
      };
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
  });
}
