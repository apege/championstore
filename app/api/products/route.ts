import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ROBUX_PACKAGES } from "@/data/pricelist";

// GET /api/products - Get all products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("all") === "true";

    let query = supabaseAdmin
      .from("products")
      .select("id, name, robux, price, is_active")
      .order("robux", { ascending: true });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    const cacheHeaders = {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    };

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: ROBUX_PACKAGES,
          fromFallback: true,
        },
        { headers: cacheHeaders }
      );
    }

    // Map database rows to frontend RobuxItem format
    const formatted = data.map((p, idx) => {
      const isPromo = p.robux === 2200;
      const isSultan = p.robux >= 10000;
      const isBestSeller = p.robux === 5500;
      let badge: string | undefined = undefined;
      if (isPromo) badge = "PROMO";
      else if (isSultan) badge = "SULTAN";
      else if (isBestSeller) badge = "POPULER";

      let category: "popular" | "promo" | "sultan" | "regular" = "regular";
      if (isSultan) category = "sultan";
      else if (isPromo) category = "promo";
      else if ([2700, 3200, 4200, 5500].includes(p.robux)) category = "popular";

      const uniqueId = p.id
        ? String(p.id).startsWith("rbx-")
          ? String(p.id)
          : `rbx-${p.id}`
        : `rbx-${p.robux}-${idx}`;

      return {
        id: uniqueId,
        dbId: p.id,
        amount: p.robux,
        price: Number(p.price),
        originalPrice: isPromo ? 50000 : isBestSeller ? 115000 : undefined,
        isPromo,
        isBestSeller,
        isSultan,
        badge,
        category,
        stock: 999,
        isActive: p.is_active,
      };
    });

    return NextResponse.json(
      { success: true, data: formatted },
      { headers: cacheHeaders }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/products - Create or update product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, price, isActive } = body;

    if (!amount || !price) {
      return NextResponse.json(
        { success: false, error: "Jumlah Robux dan Harga wajib diisi." },
        { status: 400 }
      );
    }

    const robuxNum = Number(amount);
    const priceNum = Number(price);

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        name: `${robuxNum.toLocaleString("id-ID")} Robux`,
        robux: robuxNum,
        price: priceNum,
        is_active: isActive !== undefined ? Boolean(isActive) : true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      revalidatePath("/");
    } catch (e) {
      console.warn("revalidatePath error:", e);
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH /api/products - Toggle active status or update price
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, amount, price, isActive } = body;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (price !== undefined) updates.price = Number(price);
    if (isActive !== undefined) updates.is_active = Boolean(isActive);

    let query = supabaseAdmin.from("products").update(updates);
    if (id && !isNaN(Number(id))) {
      query = query.eq("id", Number(id));
    } else if (amount) {
      query = query.eq("robux", Number(amount));
    } else {
      return NextResponse.json(
        { success: false, error: "ID atau amount produk diperlukan." },
        { status: 400 }
      );
    }

    const { data, error } = await query.select().maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      revalidatePath("/");
    } catch (e) {
      console.warn("revalidatePath error:", e);
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/products?id=123 - Delete product
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const amount = searchParams.get("amount");

    if (!id && !amount) {
      return NextResponse.json(
        { success: false, error: "ID atau nominal Robux diperlukan." },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from("products").delete();
    if (id && !isNaN(Number(id))) {
      query = query.eq("id", Number(id));
    } else if (amount) {
      query = query.eq("robux", Number(amount));
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      revalidatePath("/");
    } catch (e) {
      console.warn("revalidatePath error:", e);
    }

    return NextResponse.json({ success: true, message: "Produk berhasil dihapus." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
