import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import ShowPasswordClient from "@/components/ShowPasswordClient";

export const dynamic = "force-dynamic";

async function updatePassword(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;
  if (password !== confirm || password.length < 6) {
    redirect("/provider/change-password?error=1");
  }
  const supabase = createSupabaseServer();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/provider/change-password?error=1");
  redirect("/provider/change-password?success=1");
}

export default async function ChangePasswordPage({ searchParams }: { searchParams: { success?: string; error?: string } }) {
  const supabase = createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/auth/login");

  return <ShowPasswordClient 
    action={updatePassword} 
    success={!!searchParams.success} 
    error={!!searchParams.error} 
  />;
}
