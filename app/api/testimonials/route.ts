import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// GET /api/testimonials - List all testimonials
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // all | active | hidden | need_reply

    let query = supabaseAdmin
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter === "active") {
      query = query.eq("status", "approved");
    } else if (filter === "hidden") {
      query = query.eq("status", "rejected");
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    let results = data || [];
    if (filter === "need_reply") {
      results = results.filter((item) => !item.admin_reply);
    }

    return NextResponse.json({ success: true, data: results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/testimonials - Create or Update testimonial
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, rating, message, imagePath, orderCode, status, adminReply } = body;

    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: "Username dan ulasan testimoni wajib diisi." },
        { status: 400 }
      );
    }

    const cleanName = String(name).trim().replace(/^@/, "");
    const cleanRating = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));
    const cleanMessage = String(message).trim().slice(0, 1000);
    const cleanImage = imagePath ? String(imagePath).trim() : null;
    const cleanOrder = orderCode ? String(orderCode).trim() : null;
    const cleanStatus = status || "approved";

    if (id) {
      // Update existing
      const { data, error } = await supabaseAdmin
        .from("testimonials")
        .update({
          name: cleanName,
          rating: cleanRating,
          message: cleanMessage,
          image_path: cleanImage,
          order_code: cleanOrder,
          status: cleanStatus,
          admin_reply: adminReply || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, data });
    } else {
      // Check for recent identical review to prevent spam / duplicate submissions
      const { data: existingDuplicate } = await supabaseAdmin
        .from("testimonials")
        .select("id")
        .eq("name", cleanName)
        .eq("message", cleanMessage)
        .limit(1);

      if (existingDuplicate && existingDuplicate.length > 0) {
        return NextResponse.json(
          { success: false, error: "Ulasan ini sudah pernah dikirimkan sebelumnya!" },
          { status: 400 }
        );
      }

      // Insert new
      const { data, error } = await supabaseAdmin
        .from("testimonials")
        .insert({
          name: cleanName,
          rating: cleanRating,
          message: cleanMessage,
          image_path: cleanImage,
          order_code: cleanOrder,
          status: cleanStatus,
          admin_reply: adminReply || null,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      try {
        await supabaseAdmin.from("activity_logs").insert({
          action: "Ulasan Baru Diterima",
          details: `Ulasan ${cleanRating} Bintang dari @${cleanName}`,
          user_target: cleanName,
          order_id: cleanOrder !== "-" ? cleanOrder : null,
          type: "review",
        });
      } catch (e) {
        console.warn("Failed to record activity log:", e);
      }

      return NextResponse.json({ success: true, data });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH /api/testimonials - Update status or admin reply
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, adminReply } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID testimoni wajib diisi" }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) updatePayload.status = status;
    if (adminReply !== undefined) updatePayload.admin_reply = adminReply;

    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (adminReply) {
      try {
        await supabaseAdmin.from("activity_logs").insert({
          action: "Balasan Ulasan Dikirim",
          details: `Admin membalas ulasan dari @${data?.name || "Pelanggan"}`,
          user_target: data?.name || null,
          type: "review",
        });
      } catch (e) {
        console.warn("Failed to record activity log:", e);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/testimonials?id=123 - Delete testimonial
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID testimoni wajib diisi" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Testimoni berhasil dihapus" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
