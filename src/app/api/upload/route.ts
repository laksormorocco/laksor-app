import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "avatars";

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const ext = file.name.split(".").pop();
  const filename = folder + "/" + Date.now() + "." + ext;
  const buffer = await file.arrayBuffer();

  const { data, error } = await supabase.storage
    .from("laksor-media")
    .upload(filename, Buffer.from(buffer), { contentType: file.type, upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: urlData } = supabase.storage.from("laksor-media").getPublicUrl(filename);
  return NextResponse.json({ url: urlData.publicUrl });
}
