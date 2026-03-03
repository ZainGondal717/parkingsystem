const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Updating existing bookings to have a slotNumber of 0 if it's currently null...")
        // NOTE: In MongoDB, we can just updateMany to fix existing data.
        const res = await prisma.booking.updateMany({
            where: {
                slotNumber: {
                    equals: null
                }
            },
            data: {
                slotNumber: 0
            }
        });
        console.log(`Successfully updated ${res.count} bookings.`);
    } catch (e) {
        console.error("Prisma update error:", e);
    } finally {
        await prisma.$disconnect()
    }
}

main()
