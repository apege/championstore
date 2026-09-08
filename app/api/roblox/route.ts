import { NextRequest, NextResponse } from "next/server";

interface CachedRobloxUser {
  data: {
    id: number;
    name: string;
    displayName: string;
    avatarUrl: string;
  };
  timestamp: number;
}

const robloxCache = new Map<string, CachedRobloxUser>();
const CACHE_TTL = 3600 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUsername = searchParams.get("username");

  if (!rawUsername || !rawUsername.trim()) {
    return NextResponse.json(
      { success: false, message: "Username Roblox diperlukan" },
      { status: 400 }
    );
  }

  const username = rawUsername.trim().toLowerCase();
  const now = Date.now();

  // 1. Check in-memory cache
  const cached = robloxCache.get(username);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(
      { success: true, user: cached.data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  }

  try {
    // 2. Get Roblox User details by username
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        usernames: [rawUsername.trim()],
        excludeBannedUsers: false,
      }),
      next: { revalidate: 3600 },
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { success: false, message: "Gagal terhubung ke server Roblox" },
        { status: 502 }
      );
    }

    const userData = await userRes.json();

    if (!userData.data || userData.data.length === 0) {
      return NextResponse.json(
        { success: false, message: "Akun Roblox tidak ditemukan. Periksa kembali username Anda." },
        { status: 404 }
      );
    }

    const user = userData.data[0];
    const userId = user.id;

    // 3. Get Avatar Headshot Thumbnail from Roblox API
    let avatarUrl = "";
    try {
      const thumbRes = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`,
        { next: { revalidate: 86400 } }
      );
      if (thumbRes.ok) {
        const thumbData = await thumbRes.json();
        if (thumbData.data && thumbData.data.length > 0) {
          avatarUrl = thumbData.data[0].imageUrl || "";
        }
      }
    } catch {
      avatarUrl = "";
    }

    const resultUser = {
      id: userId,
      name: user.name,
      displayName: user.displayName || user.name,
      avatarUrl: avatarUrl,
    };

    // Save to in-memory cache
    robloxCache.set(username, {
      data: resultUser,
      timestamp: now,
    });

    return NextResponse.json(
      {
        success: true,
        user: resultUser,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Roblox API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat memeriksa akun Roblox." },
      { status: 500 }
    );
  }
}
