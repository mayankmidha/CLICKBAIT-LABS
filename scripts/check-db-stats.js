const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_URL
    }
  }
});

async function main() {
  const stats = await prisma.script.groupBy({
    by: ['channel', 'status'],
    _count: true
  });
  console.log('Stats:', JSON.stringify(stats, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
