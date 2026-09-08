import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import sharp from "sharp";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // Allow up to 10MB input since Sharp will compress it to < 100KB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/heic",
  "image/heif",
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File bukti pembayaran tidak ditemukan." },
        { status: 400 }
      );
    }

    // 1. File size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Ukuran file terlalu besar! Maksimal ukuran bukti transfer adalah 10MB.",
        },
        { status: 400 }
      );
    }

    // 2. MIME type validation
    const mimeType = file.type?.toLowerCase() || "";
    if (mimeType && !ALLOWED_MIME_TYPES.some((t) => mimeType.includes(t.replace("image/", "")))) {
      return NextResponse.json(
        {
          success: false,
          error: "Format file tidak didukung! Harap upload foto gambar (JPG, PNG, WEBP).",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    // 3. Compress & resize image to lightweight WebP using Sharp (reduces 5MB -> ~60KB)
    let optimizedBuffer: Buffer;
    try {
      optimizedBuffer = await sharp(rawBuffer)
        .rotate() // Auto-orient based on EXIF
        .resize(1200, 1200, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();
    } catch (sharpErr) {
      console.warn("Sharp compression fallback, using raw buffer:", sharpErr);
      optimizedBuffer = rawBuffer;
    }

    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.webp`;
    const filePath = `receipts/${fileName}`;

    // 4. Upload to Supabase Storage with 1-Year Immutable Cache Header (prevents repeated egress downloads)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("payment-proofs")
      .upload(filePath, optimizedBuffer, {
        contentType: "image/webp",
        cacheControl: "31536000", // 1 year cache
        upsert: true,
      });

    if (uploadError) {
      console.warn(
        "Storage upload warning, fallback to compressed data URI:",
        uploadError.message
      );
      const base64 = `data:image/webp;base64,${optimizedBuffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: base64,
        isBase64: true,
      });
    }

    // 5. Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("payment-proofs")
      .getPublicUrl(uploadData.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengupload file";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
