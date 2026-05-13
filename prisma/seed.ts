import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.guideProfile.deleteMany();
  await prisma.user.deleteMany();

  const GUIDES = [
    { name: "Youssef Alaoui", email: "youssef@laksor.ma", city: "Marrakech", bio: "Guide local passionné avec 8 ans d'expérience dans la médina de Marrakech.", halfDay: 350, fullDay: 650, exp: 8, langs: ["Français","Anglais","Arabe"], visits: ["HISTOIRE","MONUMENTS","EXPERIENCE_LOCALE"], img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
    { name: "Amina El Idrissi", email: "amina@laksor.ma", city: "Fès", bio: "Spécialiste de la culture et gastronomie de Fès. Tours culinaires authentiques.", halfDay: 300, fullDay: 600, exp: 6, langs: ["Français","Espagnol","Arabe"], visits: ["CULINAIRE","SHOPPING","ARTISANAT"], img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
    { name: "Hamza Benali", email: "hamza@laksor.ma", city: "Essaouira", bio: "Photographe et guide aventurier sur la côte atlantique marocaine.", halfDay: 350, fullDay: 700, exp: 7, langs: ["Anglais","Français","Arabe"], visits: ["AVENTURE","PHOTOGRAPHIE"], img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
    { name: "Zahra Lakhdar", email: "zahra@laksor.ma", city: "Chefchaouen", bio: "Découvrez la ville bleue avec une native passionnée de photographie.", halfDay: 300, fullDay: 600, exp: 5, langs: ["Français","Arabe","Espagnol"], visits: ["PHOTOGRAPHIE","EXPERIENCE_LOCALE"], img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
    { name: "Karim Mansouri", email: "karim@laksor.ma", city: "Agadir", bio: "Excursions désert et aventures sur la côte sud du Maroc.", halfDay: 280, fullDay: 560, exp: 9, langs: ["Français","Anglais","Arabe"], visits: ["DESERT","AVENTURE"], img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
    { name: "Fatima Zahra", email: "fatima@laksor.ma", city: "Marrakech", bio: "Experte en artisanat et tours culinaires dans la médina rouge.", halfDay: 380, fullDay: 720, exp: 10, langs: ["Français","Italien","Arabe"], visits: ["CULINAIRE","ARTISANAT","SHOPPING"], img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
    { name: "Omar Tazi", email: "omar@laksor.ma", city: "Casablanca", bio: "Tour urbain de Casablanca, architecture moderne et art déco.", halfDay: 320, fullDay: 640, exp: 4, langs: ["Français","Anglais","Arabe"], visits: ["MONUMENTS","NIGHTLIFE"], img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80" },
    { name: "Salma Berrada", email: "salma@laksor.ma", city: "Rabat", bio: "Guide historique de la capitale, sites UNESCO et palais royaux.", halfDay: 300, fullDay: 600, exp: 6, langs: ["Français","Anglais","Arabe"], visits: ["HISTOIRE","MONUMENTS"], img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80" },
    { name: "Rachid Amrani", email: "rachid@laksor.ma", city: "Merzouga", bio: "Spécialiste du désert du Sahara, bivouacs et caravanes de chameaux.", halfDay: 400, fullDay: 800, exp: 12, langs: ["Français","Anglais","Arabe","Espagnol"], visits: ["DESERT","AVENTURE","PHOTOGRAPHIE"], img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80" },
    { name: "Nadia El Fassi", email: "nadia@laksor.ma", city: "Tanger", bio: "Tanger entre Europe et Afrique, médina et histoire internationale.", halfDay: 320, fullDay: 620, exp: 7, langs: ["Français","Anglais","Espagnol","Arabe"], visits: ["HISTOIRE","EXPERIENCE_LOCALE","NIGHTLIFE"], img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80" },
  ];

  for (const g of GUIDES) {
    const supabaseId = `seed_${g.email.split("@")[0]}`;
    await prisma.user.create({
      data: {
        supabaseId,
        email: g.email,
        name: g.name,
        avatar: g.img,
        role: "GUIDE",
        guideProfile: {
          create: {
            displayName: g.name,
            bio: g.bio,
            avatar: g.img,
            city: g.city,
            coveredCities: [g.city],
            languages: g.langs,
            visitTypes: g.visits as any,
            specialties: g.langs,
            certifications: ["Guide agréé Ministère du Tourisme"],
            yearsExp: g.exp,
            halfDayPrice: g.halfDay,
            fullDayPrice: g.fullDay,
            status: "APPROVED",
            avgRating: Math.round((4.7 + Math.random() * 0.3) * 10) / 10,
            totalReviews: Math.floor(50 + Math.random() * 100),
            gallery: [g.img],
          },
        },
      },
    });
    console.log(`✅ ${g.name} (${g.city})`);
  }

  console.log(`🎉 Done! ${GUIDES.length} guides seeded.`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
