import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import ChangePasswordClient from "@/components/ChangePasswordClient";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  const supabase = createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/auth/login");
  return <ChangePasswordClient accessToken={session.access_token} />;
}
