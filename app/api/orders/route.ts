import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ROBUX_PACKAGES } from "@/data/pricelist";

const STATUS_TO_DB: Record<string, string> = {
  pending: "pending",
  processing: "processing",
  completed: "completed",
  cancelled: "cancelled",
};

// GET /api/orders - List orders with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    let query = supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status && status !== "all") {
      const dbStatus = STATUS_TO_DB[status] || status;
      query = query.eq("order_status", dbStatus);
    }

    if (search) {
      query = query.or(
        `order_code.ilike.%${search}%,roblox_username.ilike.%${search}%,customer_phone.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const formatted = (data || []).map((o) => ({
      id: o.order_code,
      order_code: o.order_code,
      db_id: o.id,
      customer_username: o.roblox_username,
      roblox_user_id: o.roblox_user_id || "-",
      customer_phone: o.customer_phone,
      total_robux: o.robux,
      total_price: o.price,
      payment_method: o.payment_method,
      source: o.payment_method === "WhatsApp" ? "WHATSAPP" : "WEBSITE",
      payment_status: o.payment_status,
      payment_proof_url: o.payment_proof_path,
      order_status: o.order_status,
      status: o.order_status,
      created_at: o.created_at,
      updated_at: o.updated_at,
      customer_notes: o.customer_notes,
      admin_notes: o.admin_notes,
      id_status: "active",
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/orders - Create new order (Public checkout & WhatsApp checkout)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderCode: reqOrderCode,
      username,
      robloxId,
      robloxUserId,
      userId,
      phone,
      customerPhone,
      items,
      robux,
      totalRobux,
      price,
      totalPrice,
      paymentMethod,
      paymentProofUrl,
      paymentProofPath,
      customerNote,
      customerNotes,
    } = body;

    // 1. Sanitize & Normalize Inputs
    const cleanUsername = String(username || "").trim().replace(/^@/, "");
    const cleanPhone = String(phone || customerPhone || "-").trim().slice(0, 25);
    const cleanRobloxId = robloxId || robloxUserId || userId ? String(robloxId || robloxUserId || userId).slice(0, 30) : null;
    const cleanNote = customerNote || customerNotes ? String(customerNote || customerNotes).trim().slice(0, 500) : null;
    const cleanProof = paymentProofUrl || paymentProofPath ? String(paymentProofUrl || paymentProofPath).slice(0, 1000) : null;

    if (!cleanUsername || cleanUsername.length < 2 || cleanUsername.length > 30) {
      return NextResponse.json(
        { success: false, error: "Username Roblox tidak valid." },
        { status: 400 }
      );
    }

    // 2. Build final items array
    let finalItems = items;
    if (!Array.isArray(finalItems) || finalItems.length === 0) {
      const amt = Number(robux || totalRobux || 0);
      const prc = Number(price || totalPrice || 0);
      if (amt > 0 && prc > 0) {
        finalItems = [{ id: `rbx-${amt}`, amount: amt, price: prc, quantity: 1 }];
      } else {
        return NextResponse.json(
          { success: false, error: "Paket Robux tidak boleh kosong." },
          { status: 400 }
        );
      }
    }

    // 3. Blacklist Check on table 'blacklists'
    const { data: blacklisted } = await supabaseAdmin
      .from("blacklists")
      .select("reason")
      .eq("roblox_username", cleanUsername)
      .maybeSingle();

    if (blacklisted) {
      return NextResponse.json(
        {
          success: false,
          error: `Akun Roblox '${cleanUsername}' telah diblacklist dari sistem. Alasan: ${blacklisted.reason || "Pelanggaran aturan"}`,
        },
        { status: 403 }
      );
    }

    // 4. Server-side price calculation
    const { data: dbProducts } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("is_active", true);

    const activePricelist = dbProducts && dbProducts.length > 0
      ? dbProducts.map((p) => ({
          id: p.id,
          amount: p.robux,
          price: Number(p.price),
        }))
      : ROBUX_PACKAGES;

    let calculatedRobux = 0;
    let calculatedPrice = 0;
    let matchedProductId: number | null = null;

    for (const item of finalItems) {
      const quantity = Math.max(1, Math.min(100, parseInt(item.quantity, 10) || 1));
      const matchedProduct = activePricelist.find(
        (p) => p.amount === Number(item.amount) || String(p.id) === String(item.id)
      );

      const itemAmount = matchedProduct ? matchedProduct.amount : Number(item.amount) || 0;
      const unitPrice = matchedProduct ? matchedProduct.price : Number(item.price) || 0;

      if (itemAmount <= 0 || unitPrice <= 0) {
        return NextResponse.json(
          { success: false, error: "Terdapat paket Robux yang tidak valid." },
          { status: 400 }
        );
      }

      calculatedRobux += itemAmount * quantity;
      calculatedPrice += unitPrice * quantity;
      if (typeof matchedProduct?.id === "number") {
        matchedProductId = matchedProduct.id;
      }
    }

    // Generate Unique Order Code CS-XXXXXXXX
    const orderCode =
      reqOrderCode && String(reqOrderCode).startsWith("CS-")
        ? String(reqOrderCode)
        : `CS-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const isWhatsApp =
      String(paymentMethod).toLowerCase().includes("whatsapp") ||
      String(paymentMethod).toLowerCase() === "wa";

    const methodStr = isWhatsApp ? "WhatsApp" : "Website";

    // 5. Insert Order into Supabase table public.orders
    const { data: newOrder, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_code: orderCode,
        product_id: matchedProductId,
        roblox_username: cleanUsername,
        roblox_user_id: cleanRobloxId,
        customer_phone: cleanPhone,
        robux: calculatedRobux,
        price: calculatedPrice,
        payment_method: methodStr,
        payment_status: "pending",
        order_status: "pending",
        payment_proof_path: cleanProof,
        customer_notes: cleanNote,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Failed to insert order:", orderError);
      return NextResponse.json(
        { success: false, error: orderError.message },
        { status: 500 }
      );
    }

    // Log to activity_logs table for Admin realtime dashboard
    try {
      await supabaseAdmin.from("activity_logs").insert({
        action: `Order Baru Masuk #${orderCode}`,
        details: `Pesanan ${calculatedRobux.toLocaleString("id-ID")} Robux dari @${cleanUsername}`,
        order_id: orderCode,
        user_target: cleanUsername,
        type: "order",
      });
    } catch (e) {
      console.warn("Failed to record activity log:", e);
    }

    return NextResponse.json({
      success: true,
      data: newOrder,
      invoiceNumber: orderCode,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH /api/orders - Update order status, notes, or id status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Order ID atau Order Code diperlukan." },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) {
      const dbStatus = STATUS_TO_DB[status] || status;
      updates.order_status = dbStatus;
      if (dbStatus === "completed") {
        updates.payment_status = "paid";
      } else if (dbStatus === "cancelled") {
        updates.payment_status = "failed";
      }
    }

    if (adminNotes !== undefined) updates.admin_notes = adminNotes;

    let query = supabaseAdmin.from("orders").update(updates);
    if (!isNaN(Number(id))) {
      query = query.or(`id.eq.${id},order_code.eq.${id}`);
    } else {
      query = query.eq("order_code", String(id));
    }

    const { data, error } = await query.select().maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Log to activity_logs table
    if (data && status !== undefined) {
      const dbStatus = updates.order_status || status;
      let actType = "status";
      let actionText = `Update Status #${data.order_code || id}`;
      let detailsText = `Status diubah menjadi "${dbStatus}"`;

      if (dbStatus === "completed") {
        actType = "success";
        actionText = `Order Selesai #${data.order_code || id}`;
        detailsText = `Pesanan ${Number(data.robux || 0).toLocaleString("id-ID")} Robux sukses dikirim ke @${data.roblox_username}`;
      } else if (dbStatus === "processing") {
        actType = "processing";
        actionText = `Order Diproses #${data.order_code || id}`;
        detailsText = `Pesanan @${data.roblox_username} sedang diproses admin`;
      } else if (dbStatus === "cancelled") {
        actType = "cancelled";
        actionText = `Order Dibatalkan #${data.order_code || id}`;
        detailsText = `Pesanan @${data.roblox_username} dibatalkan`;
      }

      try {
        await supabaseAdmin.from("activity_logs").insert({
          action: actionText,
          details: detailsText,
          order_id: data.order_code || String(id),
          user_target: data.roblox_username || null,
          type: actType,
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

// DELETE /api/orders?id=CS-123 - Delete order
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID order diperlukan." }, { status: 400 });
    }

    let query = supabaseAdmin.from("orders").delete();
    if (!isNaN(Number(id))) {
      query = query.or(`id.eq.${id},order_code.eq.${id}`);
    } else {
      query = query.eq("order_code", String(id));
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      await supabaseAdmin.from("activity_logs").insert({
        action: `Order Dihapus #${id}`,
        details: `Data order #${id} dihapus dari sistem`,
        order_id: String(id),
        type: "system",
      });
    } catch (e) {
      console.warn("Failed to record activity log:", e);
    }

    return NextResponse.json({ success: true, message: "Order berhasil dihapus." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
