const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function fixData() {
    const uri = process.env.DATABASE_URL;
    if (!uri) {
        console.error("No DATABASE_URL found");
        return;
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(); // uses db from URI
        const bookings = db.collection('Booking');

        const result = await bookings.updateMany(
            { slotNumber: null },
            { $set: { slotNumber: 0 } }
        );

        console.log(`Updated ${result.modifiedCount} bookings with null slotNumber.`);
    } catch (e) {
        console.error("Migration error:", e);
    } finally {
        await client.close();
    }
}

fixData();
