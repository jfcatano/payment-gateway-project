"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log(`Start seeding ...`);
    await prisma.product.deleteMany();
    console.log('Deleted existing products.');
    await prisma.product.create({
        data: {
            name: 'iPhone 16 Pro',
            description: 'The most advanced iPhone actually.',
            price: 5000000,
            stock: 50,
        },
    });
    await prisma.product.create({
        data: {
            name: 'Air Pods Pro 3',
            description: 'The best sound quality in the market.',
            price: 750000,
            stock: 120,
        },
    });
    await prisma.product.create({
        data: {
            name: 'Samsung Galaxy S24',
            description: 'The best Android phone in the market.',
            price: 6299000,
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
//# sourceMappingURL=seed.js.map