import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    // Fetch all orders to compute customer stats
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("roblox_username, roblox_user_id, customer_phone, price, order_status, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Group by roblox_username
    const customerMap = new Map<
      string,
      {
        id: string;
        roblox_username: string;
        roblox_id: string;
        phone: string;
        total_orders: number;
        total_spent: number;
        last_order_at: string;
      }
    >();

    for (const ord of orders || []) {
      const username = ord.roblox_username;
      if (!username) continue;

      const existing = customerMap.get(username);
      if (existing) {
        existing.total_orders += 1;
        existing.total_spent += Number(ord.price || 0);
        if (ord.roblox_user_id && existing.roblox_id === "Belum terdata") {
          existing.roblox_id = ord.roblox_user_id;
        }
        if (ord.customer_phone && existing.phone === "Belum terdata") {
          existing.phone = ord.customer_phone;
        }
      } else {
        customerMap.set(username, {
          id: username,
          roblox_username: username,
          roblox_id: ord.roblox_user_id || "Belum terdata",
          phone: ord.customer_phone || "Belum terdata",
          total_orders: 1,
          total_spent: Number(ord.price || 0),
          last_order_at: ord.created_at,
        });
      }
    }

    let customers = Array.from(customerMap.values()).sort(
      (a, b) => b.total_spent - a.total_spent
    );

    if (search) {
      const s = search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.roblox_username.toLowerCase().includes(s) ||
          c.phone.toLowerCase().includes(s) ||
          c.roblox_id.toLowerCase().includes(s)
      );
    }

    return NextResponse.json({ success: true, data: customers });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
