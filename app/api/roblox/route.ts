import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username || !username.trim()) {
    return NextResponse.json(
      { success: false, message: "Username Roblox diperlukan" },
      { status: 400 }
    );
  }

  try {
    // 1. Get Roblox User details by username
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        usernames: [username.trim()],
        excludeBannedUsers: false,
      }),
      cache: "no-store",
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

    // 2. Get Avatar Headshot Thumbnail from Roblox API
    let avatarUrl = "";
    try {
      const thumbRes = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`,
        { cache: "no-store" }
      );
      if (thumbRes.ok) {
        const thumbData = await thumbRes.json();
        if (thumbData.data && thumbData.data.length > 0) {
          avatarUrl = thumbData.data[0].imageUrl || "";
        }
      }
    } catch {
      // Fallback if thumbnail fails
      avatarUrl = "";
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: user.name,
        displayName: user.displayName || user.name,
        avatarUrl: avatarUrl,
      },
    });
  } catch (error) {
    console.error("Roblox API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat memeriksa akun Roblox." },
      { status: 500 }
    );
  }
}
