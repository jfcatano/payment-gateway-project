// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Borra datos existentes (opcional, cuidado en producción)
  await prisma.product.deleteMany();
  console.log('Deleted existing products.');

  // Crea productos dummy
  await prisma.product.create({
    data: {
      name: 'Awesome Gadget',
      description: 'The most awesome gadget you will ever need.',
      price: 99.99,
      stock: 50,
    },
  });

   await prisma.product.create({
    data: {
      name: 'Super Widget',
      description: 'A widget that surpasses all others.',
      price: 45.50,
      stock: 120,
    },
  });

   await prisma.product.create({
    data: {
      name: 'Hyper Component',
      description: 'Component for advanced users.',
      price: 199.00,
      stock: 15,
    },
  });

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });