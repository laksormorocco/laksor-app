import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/auth/reset-password";
  
  if (code) {
    return NextResponse.redirect(new URL(`/auth/reset-password?code=${code}`, url.origin));
  }
  
  return NextResponse.redirect(new URL(next, url.origin));
}
