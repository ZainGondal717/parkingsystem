import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
    try {
        const id = req.url.split('bookings/')[1];
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { lot: true }
        });

        if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

        return NextResponse.json(booking);
    } catch (error) {
        console.error("Fetch Booking Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
