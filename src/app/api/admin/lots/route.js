import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const lots = await prisma.parkingLot.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(lots);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch lots' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const data = await req.json();
        const newLot = await prisma.parkingLot.create({
            data: {
                name: data.name,
                capacity: parseInt(data.capacity),
                address: data.address,
                latitude: data.latitude ? parseFloat(data.latitude) : null,
                longitude: data.longitude ? parseFloat(data.longitude) : null,
                halfHourRate: parseFloat(data.halfHourRate) || 0,
                hourlyRate: parseFloat(data.hourlyRate) || 0,
                dailyRate: parseFloat(data.dailyRate) || 0,
                weeklyRate: parseFloat(data.weeklyRate) || 0,
                monthlyRate: parseFloat(data.monthlyRate) || 0,
            },
        });
        return NextResponse.json(newLot);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create lot' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const data = await req.json();
        const updatedLot = await prisma.parkingLot.update({
            where: { id: data.id },
            data: {
                name: data.name,
                capacity: parseInt(data.capacity),
                address: data.address,
                latitude: data.latitude ? parseFloat(data.latitude) : null,
                longitude: data.longitude ? parseFloat(data.longitude) : null,
                halfHourRate: parseFloat(data.halfHourRate) || 0,
                hourlyRate: parseFloat(data.hourlyRate) || 0,
                dailyRate: parseFloat(data.dailyRate) || 0,
                weeklyRate: parseFloat(data.weeklyRate) || 0,
                monthlyRate: parseFloat(data.monthlyRate) || 0,
            },
        });
        return NextResponse.json(updatedLot);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update lot' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();
        await prisma.parkingLot.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Lot deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete lot' }, { status: 500 });
    }
}
