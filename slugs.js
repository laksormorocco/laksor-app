const {PrismaClient}=require('@prisma/client');
const p=new PrismaClient();
function toSlug(name) {
  return name.toLowerCase()
    .replace(/[àáâãäå]/g,'a').replace(/[èéêë]/g,'e').replace(/[ìíîï]/g,'i')
    .replace(/[òóôõö]/g,'o').replace(/[ùúûü]/g,'u').replace(/[ç]/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
async function main() {
  const guides = await p.guideProfile.findMany({select:{id:true,displayName:true,slug:true}});
  for (const g of guides) {
    if (!g.slug) {
      const slug = toSlug(g.displayName);
      await p.guideProfile.update({where:{id:g.id},data:{slug}});
      console.log(g.displayName, '->', slug);
    }
  }
  console.log('done');
}
main().finally(()=>p.$disconnect());
