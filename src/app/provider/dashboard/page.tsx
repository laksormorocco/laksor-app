import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import ProviderDashboardClient from "@/components/ProviderDashboardClient";

export const dynamic = "force-dynamic";

export default async function ProviderDashboardPage() {
  const supabase = createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) redirect("/auth/login");

  const provider = await prisma.provider.findUnique({
    where: { supabaseId: session.user.id },
    include: { experiences: { orderBy: { createdAt: "desc" } } }
  });

  if (!provider) redirect("/provider/register");

  const expIds = (provider as any).experiences?.map((e: any) => e.id) || [];
  const bookings = expIds.length > 0 ? await prisma.booking.findMany({
    where: { status: "CONFIRMED", notes: { contains: "EXP:" } },
    select: { totalPrice: true, persons: true, createdAt: true, notes: true }
  }).then(bs => bs.filter(b => expIds.some((id: string) => b.notes?.includes("EXP:" + id)))
    .map(b => { const exp = (provider as any).experiences?.find((e: any) => b.notes?.includes("EXP:" + e.id)); return {...b, expTitle: exp?.title || "Expérience"}; })
  ) : [];

  return <ProviderDashboardClient provider={JSON.parse(JSON.stringify(provider))} bookings={JSON.parse(JSON.stringify(bookings))} />;
}
