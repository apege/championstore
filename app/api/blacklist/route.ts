import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// GET /api/blacklist
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let query = supabaseAdmin
      .from("blacklists")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      const cleanSearch = search.replace(/[%_]/g, "");
      query = query.or(
        `roblox_username.ilike.%${cleanSearch}%,phone.ilike.%${cleanSearch}%,reason.ilike.%${cleanSearch}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/blacklist - Add user to blacklist
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, phone, reason, robloxId } = body;

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username harus diisi." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim().replace(/^@/, "");

    const { data, error } = await supabaseAdmin
      .from("blacklists")
      .upsert({
        roblox_username: cleanUsername,
        phone: phone ? String(phone).trim() : null,
        roblox_user_id: robloxId ? String(robloxId).trim() : null,
        reason: reason ? String(reason).trim() : "Indikasi penipuan atau penyalahgunaan",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      await supabaseAdmin.from("activity_logs").insert({
        action: "Blacklist Pelanggan",
        details: `Akun @${cleanUsername} dimasukkan ke daftar blacklist`,
        user_target: cleanUsername,
        type: "blacklist",
      });
    } catch (e) {
      console.warn("Failed to record activity log:", e);
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/blacklist - Remove user from blacklist
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const username = searchParams.get("username");

    if (!id && !username) {
      return NextResponse.json(
        { success: false, error: "ID atau Username diperlukan." },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from("blacklists").delete();
    if (id && !isNaN(Number(id))) {
      query = query.eq("id", Number(id));
    } else if (username) {
      query = query.eq("roblox_username", username);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      await supabaseAdmin.from("activity_logs").insert({
        action: "Hapus dari Blacklist",
        details: `Akun ${username ? `@${username}` : `#${id}`} telah dipulihkan dari blacklist`,
        user_target: username || null,
        type: "system",
      });
    } catch (e) {
      console.warn("Failed to record activity log:", e);
    }

    return NextResponse.json({
      success: true,
      message: "User berhasil dihapus dari blacklist.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
