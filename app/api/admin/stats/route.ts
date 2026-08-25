import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    // 1. Fetch orders stats
    const { data: orders, error: ordersErr } = await supabaseAdmin
      .from("orders")
      .select("id, price, order_status, roblox_username, created_at");

    if (ordersErr) {
      return NextResponse.json({ success: false, error: ordersErr.message }, { status: 500 });
    }

    // 2. Fetch blacklist count
    const { count: blacklistCount } = await supabaseAdmin
      .from("blacklists")
      .select("*", { count: "exact", head: true });

    const totalOrders = orders?.length || 0;
    const pendingOrders = orders?.filter((o) => o.order_status === "pending").length || 0;
    const processingOrders = orders?.filter((o) => o.order_status === "processing").length || 0;
    const completedOrders = orders?.filter((o) => o.order_status === "completed").length || 0;
    const cancelledOrders = orders?.filter((o) => o.order_status === "cancelled").length || 0;

    const totalRevenue =
      orders
        ?.filter((o) => o.order_status === "completed")
        .reduce((sum, o) => sum + Number(o.price || 0), 0) || 0;

    // Unique customers count
    const uniqueUsers = new Set(
      (orders || []).map((o) => o.roblox_username).filter(Boolean)
    );

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        cancelledOrders,
        totalCustomers: uniqueUsers.size || 0,
        totalBlacklist: blacklistCount || 0,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
