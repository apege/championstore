/**
 * Compresses an image File to WebP format using the Canvas API.
 * Works in any modern browser environment.
 *
 * @param file     - The original image File object
 * @param quality  - WebP quality 0–1 (default 0.82)
 * @param maxWidth - Max width in pixels; image is scaled down proportionally if wider (default 1600)
 * @returns A new File in image/webp format
 */
export function compressToWebP(
  file: File,
  quality = 0.82,
  maxWidth = 1600
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Calculate dimensions, scaling down if needed
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas toBlob returned null"));
            return;
          }
          // Rename to .webp extension
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const webpFile = new File([blob], `${baseName}.webp`, {
            type: "image/webp",
            lastModified: Date.now(),
          });
          resolve(webpFile);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for compression"));
    };

    img.src = objectUrl;
  });
}
