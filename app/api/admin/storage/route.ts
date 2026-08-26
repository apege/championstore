import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import JSZip from "jszip";

// Retention Policy Constants
const RETENTION_DAYS = 90; // Automatically delete after 90 days
const WARNING_DAYS = 83; // Start warning 7 days before deletion (day 83)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    // Fetch all orders with a payment proof
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("id, order_code, roblox_username, payment_proof_path, created_at, price, robux")
      .not("payment_proof_path", "is", null)
      .order("created_at", { ascending: true });

    if (ordersError) {
      return NextResponse.json({ success: false, error: ordersError.message }, { status: 500 });
    }

    const now = Date.now();
    const validOrdersWithProof = (orders || []).filter(
      (o) =>
        o.payment_proof_path &&
        !o.payment_proof_path.startsWith("[Dihapus") &&
        o.payment_proof_path !== "-"
    );

    const expiringSoon: Array<{
      order_code: string;
      roblox_username: string;
      created_at: string;
      daysOld: number;
      daysRemaining: number;
      payment_proof_path: string;
      price: number;
      robux: number;
    }> = [];

    const expiredOrders: Array<{
      id: number;
      order_code: string;
      payment_proof_path: string;
      created_at: string;
    }> = [];

    let totalProofs = validOrdersWithProof.length;

    for (const order of validOrdersWithProof) {
      const orderDate = new Date(order.created_at).getTime();
      const ageInDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

      if (ageInDays >= RETENTION_DAYS) {
        expiredOrders.push(order);
      } else if (ageInDays >= WARNING_DAYS) {
        const daysRemaining = Math.max(1, RETENTION_DAYS - ageInDays);
        expiringSoon.push({
          order_code: order.order_code,
          roblox_username: order.roblox_username,
          created_at: order.created_at,
          daysOld: ageInDays,
          daysRemaining,
          payment_proof_path: order.payment_proof_path,
          price: order.price,
          robux: order.robux,
        });
      }
    }

    // -------------------------------------------------------------
    // ACTION: DOWNLOAD AS ZIP ARCHIVE
    // -------------------------------------------------------------
    if (action === "download-zip") {
      const scope = searchParams.get("scope") || "expiring"; // "expiring" or "all"
      const targetOrders = scope === "all" ? validOrdersWithProof : expiringSoon;

      if (targetOrders.length === 0) {
        return NextResponse.json(
          { success: false, error: "Tidak ada bukti transfer untuk diunduh." },
          { status: 400 }
        );
      }

      const zip = new JSZip();
      const folder = zip.folder(`bukti_transfer_${scope === "all" ? "semua" : "expiring_90hari"}`);

      for (let i = 0; i < targetOrders.length; i++) {
        const ord = targetOrders[i];
        try {
          const proofUrl = ord.payment_proof_path;
          let imageBuffer: Buffer | null = null;
          let ext = "webp";

          if (proofUrl.startsWith("data:image/")) {
            // Base64 Data URL
            const matches = proofUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
            if (matches) {
              ext = matches[1] === "jpeg" ? "jpg" : matches[1];
              imageBuffer = Buffer.from(matches[2], "base64");
            }
          } else {
            // URL from Supabase Storage or external
            const imgRes = await fetch(proofUrl);
            if (imgRes.ok) {
              const arrayBuf = await imgRes.arrayBuffer();
              imageBuffer = Buffer.from(arrayBuf);
              const contentType = imgRes.headers.get("content-type") || "";
              if (contentType.includes("png")) ext = "png";
              else if (contentType.includes("jpeg") || contentType.includes("jpg")) ext = "jpg";
              else ext = "webp";
            }
          }

          if (imageBuffer && folder) {
            const safeUsername = (ord.roblox_username || "guest").replace(/[^a-zA-Z0-9_-]/g, "");
            const dateStr = new Date(ord.created_at).toISOString().slice(0, 10);
            const fileName = `${ord.order_code}_${safeUsername}_${dateStr}.${ext}`;
            folder.file(fileName, imageBuffer);
          }
        } catch (itemErr) {
          console.warn(`Failed to package image for ${ord.order_code}:`, itemErr);
        }
      }

      // Add a README manifest summary text file inside the ZIP
      const manifestContent =
        `=======================================================\n` +
        `CHAMPIONSTORE - ARSIP CADANGAN BUKTI TRANSFER (90 HARI)\n` +
        `Tanggal Ekspor : ${new Date().toLocaleString("id-ID")}\n` +
        `Total File     : ${targetOrders.length} Bukti Pembayaran\n` +
        `=======================================================\n\n` +
        targetOrders
          .map(
            (o) =>
              `• ${o.order_code} | @${o.roblox_username} | Rp ${Number(o.price || 0).toLocaleString("id-ID")} | ${new Date(o.created_at).toLocaleDateString("id-ID")}`
          )
          .join("\n");

      zip.file("DAFTAR_TRANSAKSI_MANIFEST.txt", manifestContent);

      const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
      const nowStr = new Date().toISOString().slice(0, 10);

      return new NextResponse(zipBuffer as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="bukti-transfer-championstore-${nowStr}.zip"`,
        },
      });
    }

    // -------------------------------------------------------------
    // DEFAULT: RETURN STORAGE METRICS & EXPIRING STATUS
    // -------------------------------------------------------------
    return NextResponse.json({
      success: true,
      data: {
        totalProofsCount: totalProofs,
        expiringSoonCount: expiringSoon.length,
        expiredCount: expiredOrders.length,
        shouldWarn: expiringSoon.length > 0 || expiredOrders.length > 0,
        warningDays: WARNING_DAYS,
        retentionDays: RETENTION_DAYS,
        oldestDaysRemaining:
          expiringSoon.length > 0
            ? Math.min(...expiringSoon.map((e) => e.daysRemaining))
            : null,
        expiringSoonList: expiringSoon,
        storageFreeLimit: "1.00 GB",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memeriksa status storage";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// -------------------------------------------------------------
// POST /api/admin/storage - Auto/Manual Clean Expired Proofs (>90 Days)
// -------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const now = Date.now();
    const ninetyDaysAgo = new Date(now - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();

    // Find all orders with proof older than 90 days
    const { data: expiredOrders, error: findError } = await supabaseAdmin
      .from("orders")
      .select("id, order_code, payment_proof_path, created_at")
      .lt("created_at", ninetyDaysAgo)
      .not("payment_proof_path", "is", null)
      .not("payment_proof_path", "ilike", "[Dihapus%");

    if (findError) {
      return NextResponse.json({ success: false, error: findError.message }, { status: 500 });
    }

    let deletedStorageFilesCount = 0;
    const orderIdsToUpdate: number[] = [];

    for (const ord of expiredOrders || []) {
      orderIdsToUpdate.push(ord.id);

      // If file is stored in Supabase Storage bucket 'payment-proofs'
      if (ord.payment_proof_path && ord.payment_proof_path.includes("payment-proofs")) {
        try {
          // Extract filename from URL or path
          const urlParts = ord.payment_proof_path.split("payment-proofs/");
          if (urlParts.length > 1) {
            const rawPath = decodeURIComponent(urlParts[1].split("?")[0]);
            await supabaseAdmin.storage.from("payment-proofs").remove([rawPath]);
            deletedStorageFilesCount++;
          }
        } catch (delErr) {
          console.warn(`Failed to delete storage file for order ${ord.order_code}:`, delErr);
        }
      }
    }

    // Update database records to indicate proof was cleaned
    if (orderIdsToUpdate.length > 0) {
      await supabaseAdmin
        .from("orders")
        .update({
          payment_proof_path: `[Dihapus Otomatis (Retensi 90 Hari - ${new Date().toLocaleDateString("id-ID")})]`,
        })
        .in("id", orderIdsToUpdate);
    }

    return NextResponse.json({
      success: true,
      message: `Pembersihan berhasil! ${orderIdsToUpdate.length} foto bukti transfer berusia >90 hari telah dihapus dari Supabase Storage.`,
      cleanedCount: orderIdsToUpdate.length,
      storageFilesDeleted: deletedStorageFilesCount,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal membersihkan storage";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
