const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_URL
    }
  }
});

async function main() {
  const techCount = await prisma.script.count({ where: { channel: 'tech' } });
  const financeCount = await prisma.script.count({ where: { channel: 'finance' } });
  console.log(`Tech Scripts: ${techCount}`);
  console.log(`Finance Scripts: ${financeCount}`);
  
  const sample = await prisma.script.findMany({ take: 5, select: { title: true, channel: true } });
  console.log('Sample Scripts:', sample);
}

main().catch(console.error).finally(() => prisma.$disconnect());
