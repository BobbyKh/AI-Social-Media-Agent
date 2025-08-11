export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
  const res = await fetch(`${base}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: body.username, password: body.password }),
    cache: "no-store",
  });
  if (!res.ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const json = await res.json();
  const c = cookies();
  c.set("access", json.access, { httpOnly: true, sameSite: "lax", path: "/" });
  c.set("refresh", json.refresh, { httpOnly: true, sameSite: "lax", path: "/" });
  return NextResponse.json({ ok: true });
}


