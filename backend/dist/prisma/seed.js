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
//# sourceMappingURL=seed.js.map