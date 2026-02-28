import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const lotId = searchParams.get('lotId');

        if (!lotId) {
            return NextResponse.json({ error: 'Lot ID is required' }, { status: 400 });
        }

        const lot = await prisma.parkingLot.findUnique({
            where: { id: lotId }
        });

        if (!lot) {
            return NextResponse.json({ error: 'Lot not found' }, { status: 404 });
        }

        // Get all bookings for this lot using findRaw to bypass Prisma's non-nullable mapping crash
        let bookings = [];
        try {
            // Raw query to get all bookings for this lotId
            const rawBookings = await prisma.booking.findRaw({
                filter: {
                    lotId: { $oid: lotId }
                }
            });
            // Normalize raw booking structure
            bookings = Array.isArray(rawBookings) ? rawBookings.map(b => ({
                id: b._id?.$oid || b._id?.toString() || b.id,
                createdAt: b.createdAt?.$date || b.createdAt,
                durationMode: b.durationMode,
                durationValue: b.durationValue,
                slotNumber: b.slotNumber
            })) : [];
        } catch (err) {
            console.error("Critical error in findRaw:", err);
            // Fallback: If findRaw exists but something went wrong
            bookings = [];
        }

        const now = new Date();
        const nowMs = now.getTime();

        // Helper to check if a booking is active
        const isActive = (booking) => {
            const start = new Date(booking.createdAt);
            const startMs = start.getTime();
            let endMs = startMs;

            const value = booking.durationValue || 0;
            switch (booking.durationMode) {
                case 'half':
                    endMs = startMs + (30 * 60 * 1000);
                    break;
                case 'hourly':
                    endMs = startMs + (value * 60 * 60 * 1000);
                    break;
                case 'daily':
                    endMs = startMs + (value * 24 * 60 * 60 * 1000);
                    break;
                case 'weekly':
                    endMs = startMs + (value * 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'monthly':
                    const endObj = new Date(start);
                    endObj.setMonth(start.getMonth() + Math.floor(value));
                    endMs = endObj.getTime();
                    break;
                default:
                    return false;
            }

            const active = nowMs < endMs;
            if (active && booking.slotNumber) {
                console.log(`[Slot Occupied] Slot #${booking.slotNumber}, ID: ${booking.id}, Ends: ${new Date(endMs).toLocaleString()}`);
            }
            return active;
        };

        // 1. Establish helper for end-time within this context
        const getExpiry = (booking) => {
            const start = new Date(booking.createdAt);
            const startMs = start.getTime();
            let endMs = startMs;
            const value = booking.durationValue || 0;
            switch (booking.durationMode) {
                case 'half': endMs = startMs + (30 * 60 * 1000); break;
                case 'hourly': endMs = startMs + (value * 60 * 60 * 1000); break;
                case 'daily': endMs = startMs + (value * 24 * 60 * 60 * 1000); break;
                case 'weekly': endMs = startMs + (value * 7 * 24 * 60 * 60 * 1000); break;
                case 'monthly':
                    const endObj = new Date(start);
                    endObj.setMonth(start.getMonth() + Math.floor(value));
                    endMs = endObj.getTime();
                    break;
                default: return 0;
            }
            return endMs;
        };

        const activeBookings = bookings.filter(isActive);
        const total = Math.max(0, lot.capacity || 0);

        // Map of slotNumber to booking info
        const occupancyMap = {};
        activeBookings.forEach(b => {
            if (b.slotNumber != null) {
                occupancyMap[b.slotNumber] = {
                    id: b.id,
                    expiresAt: getExpiry(b)
                };
            }
        });

        // Generate full slot list with status
        const allSlots = Array.from({ length: total }, (_, i) => {
            const num = i + 1;
            const occ = occupancyMap[num];
            return {
                number: num,
                status: occ ? 'busy' : 'available',
                expiresAt: occ ? occ.expiresAt : null
            };
        });

        // Accounting for unassigned active bookings (legacy/error states)
        const unassignedActiveCount = activeBookings.filter(b => b.slotNumber == null).length;
        if (unassignedActiveCount > 0) {
            let handled = 0;
            for (let i = 0; i < allSlots.length && handled < unassignedActiveCount; i++) {
                if (allSlots[i].status === 'available') {
                    allSlots[i].status = 'busy';
                    allSlots[i].isUnassigned = true;
                    handled++;
                }
            }
        }

        return NextResponse.json({
            slots: allSlots,
            totalSlots: total,
            now: nowMs
        });
    } catch (error) {
        console.error("Fetch Available Slots Error:", error);
        return NextResponse.json({ error: 'Failed to fetch available slots' }, { status: 500 });
    }
}
