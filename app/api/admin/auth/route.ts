import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_USERNAME || "admin_championstore";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "@ChampionStore2026";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "championstore_super_secret_admin_session_key_2026";

// POST /api/admin/auth - Login
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const response = NextResponse.json({
        success: true,
        message: "Login berhasil.",
      });

      // Set auth cookie (httpOnly for security)
      response.cookies.set("champion_admin_session", SESSION_SECRET, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Username atau Password Admin salah!" },
      { status: 401 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// GET /api/admin/auth - Verify current session
export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("champion_admin_session")?.value;

  if (sessionCookie === SESSION_SECRET) {
    return NextResponse.json({ success: true, authenticated: true });
  }

  return NextResponse.json(
    { success: false, authenticated: false },
    { status: 401 }
  );
}

// DELETE /api/admin/auth - Logout
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Logout berhasil.",
  });

  response.cookies.set("champion_admin_session", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });

  return response;
}
