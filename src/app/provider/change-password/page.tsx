import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

async function updatePassword(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;
  if (password !== confirm || password.length < 6) return;
  const supabase = createSupabaseServer();
  await supabase.auth.updateUser({ password });
  redirect("/provider/dashboard");
}

export default async function ChangePasswordPage() {
  const supabase = createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/auth/login");

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"#F6F1E8"}}>
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-4" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.06)"}}>
          <div className="font-display text-lg font-bold text-charcoal-800 mb-2">Changer le mot de passe</div>
          <form action={updatePassword} className="flex flex-col gap-3">
            <input type="password" name="password" placeholder="Nouveau mot de passe" required minLength={6}
              className="w-full border-2 border-sand-300 rounded-xl px-4 py-3 text-sm outline-none bg-sand-100" />
            <input type="password" name="confirm" placeholder="Confirmer le mot de passe" required minLength={6}
              className="w-full border-2 border-sand-300 rounded-xl px-4 py-3 text-sm outline-none bg-sand-100" />
            <button type="submit"
              className="w-full py-4 rounded-full text-sm font-bold text-white"
              style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 16px rgba(184,138,68,0.4)"}}>
              Mettre à jour
            </button>
          </form>
          <a href="/provider/dashboard" className="text-center text-xs text-charcoal-400 no-underline">Annuler</a>
        </div>
      </div>
    </div>
  );
}
