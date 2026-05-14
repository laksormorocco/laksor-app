import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const guideId = url.searchParams.get("guideId");
  if (!guideId) return NextResponse.json({ error: "guideId requis" }, { status: 400 });

  const guide = await prisma.guideProfile.findUnique({ where: { id: guideId } });
  const bookings = await prisma.booking.findMany({ where: { guideId } });

  const totalRevenue = bookings.filter(b=>["CONFIRMED","COMPLETED"].includes(b.status)).reduce((s,b)=>s+b.totalPrice,0);
  const completedTours = bookings.filter(b=>b.status==="COMPLETED").length;
  const pendingBookings = bookings.filter(b=>b.status==="PENDING").length;
  const confirmedBookings = bookings.filter(b=>b.status==="CONFIRMED").length;
  const cancelledBookings = bookings.filter(b=>b.status==="CANCELLED").length;
  const totalBookings = bookings.length;
  const acceptanceRate = totalBookings>0?Math.round((confirmedBookings+completedTours)/totalBookings*100):0;

  const durationStats = [
    {type:"HALF_DAY",count:bookings.filter(b=>b.duration==="HALF_DAY").length},
    {type:"FULL_DAY",count:bookings.filter(b=>b.duration==="FULL_DAY").length},
  ];

  const months = ["Jan","Fev","Mar","Avr","Mai","Jun","Jul","Aou","Sep","Oct","Nov","Dec"];
  const monthlyRevenue = months.map((month,i)=>({
    month,
    revenue: bookings.filter(b=>new Date(b.date).getMonth()===i&&["CONFIRMED","COMPLETED"].includes(b.status)).reduce((s,b)=>s+b.totalPrice,0)
  })).slice(0,new Date().getMonth()+1);

  return NextResponse.json({
    totalRevenue,totalBookings,completedTours,
    pendingBookings,confirmedBookings,cancelledBookings,
    acceptanceRate,durationStats,monthlyRevenue,
    avgRating:guide?.avgRating||0,
  });
}
