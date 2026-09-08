import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // 1. Fetch from activity_logs
    const { data: logsData } = await supabaseAdmin
      .from("activity_logs")
      .select("id, action, details, order_id, user_target, type, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    const logs = Array.isArray(logsData) ? [...logsData] : [];

    // 2. If activity_logs has fewer items than limit, populate from real orders & testimonials
    if (logs.length < limit) {
      // Fetch recent orders
      const { data: ordersData } = await supabaseAdmin
        .from("orders")
        .select("id, order_code, order_status, robux, roblox_username, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (ordersData && Array.isArray(ordersData)) {
        for (const o of ordersData) {
          const exists = logs.some(
            (l) => l.order_id === o.order_code || l.action?.includes(o.order_code)
          );
          if (!exists) {
            const status = o.order_status || "pending";
            let type = "order";
            let action = `Order Baru #${o.order_code}`;
            let details = `Pesanan ${Number(o.robux || 0).toLocaleString("id-ID")} Robux dari @${o.roblox_username}`;

            if (status === "completed") {
              type = "success";
              action = `Order Selesai #${o.order_code}`;
              details = `Pesanan ${Number(o.robux || 0).toLocaleString("id-ID")} Robux sukses dikirim ke @${o.roblox_username}`;
            } else if (status === "processing") {
              type = "processing";
              action = `Order Diproses #${o.order_code}`;
              details = `Pesanan @${o.roblox_username} sedang diproses`;
            } else if (status === "cancelled") {
              type = "cancelled";
              action = `Order Dibatalkan #${o.order_code}`;
              details = `Pesanan @${o.roblox_username} dibatalkan`;
            }

            logs.push({
              id: `ord-${o.id || o.order_code}`,
              action,
              details,
              order_id: o.order_code,
              user_target: o.roblox_username,
              type,
              created_at: o.created_at || new Date().toISOString(),
            });
          }
        }
      }

      // Fetch recent testimonials
      const { data: testData } = await supabaseAdmin
        .from("testimonials")
        .select("id, name, rating, order_code, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

      if (testData && Array.isArray(testData)) {
        for (const t of testData) {
          const exists = logs.some(
            (l) => l.details?.includes(t.name) || l.user_target === t.name
          );
          if (!exists) {
            logs.push({
              id: `test-${t.id}`,
              action: "Ulasan Baru",
              details: `Ulasan ${t.rating} Bintang dari @${t.name}`,
              user_target: t.name,
              order_id: t.order_code !== "-" ? t.order_code : null,
              type: "review",
              created_at: t.created_at || new Date().toISOString(),
            });
          }
        }
      }
    }

    // Sort combined by created_at descending
    logs.sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime();
      const timeB = new Date(b.created_at || 0).getTime();
      return timeB - timeA;
    });

    const finalResult = logs.slice(0, limit);

    return NextResponse.json({ success: true, data: finalResult });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
