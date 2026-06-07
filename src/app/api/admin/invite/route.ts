import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { email, name } = await req.json();
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { name },
    redirectTo: process.env.NEXT_PUBLIC_APP_URL + "/auth/callback"
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
