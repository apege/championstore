import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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
          error: "Ukuran file terlalu besar! Maksimal ukuran bukti transfer adalah 5MB.",
        },
        { status: 400 }
      );
    }

    // 2. MIME type validation
    const mimeType = file.type?.toLowerCase() || "";
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: "Format file tidak didukung! Harap upload foto gambar (JPG, PNG, WEBP).",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension
    let fileExt = "jpg";
    if (mimeType.includes("png")) fileExt = "png";
    else if (mimeType.includes("webp")) fileExt = "webp";
    else if (mimeType.includes("heic")) fileExt = "heic";

    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("payment-proofs")
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.warn(
        "Storage upload warning, fallback to data URI:",
        uploadError.message
      );
      const base64 = `data:${mimeType};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: base64,
        isBase64: true,
      });
    }

    // Get public URL
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
