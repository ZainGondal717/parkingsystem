import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const proposals = await prisma.landlordProposal.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(proposals);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const data = await req.json();
        const newProposal = await prisma.landlordProposal.create({
            data: {
                lotName: data.lotName,
                address: data.address,
                latitude: data.latitude ? parseFloat(data.latitude) : null,
                longitude: data.longitude ? parseFloat(data.longitude) : null,
                spots: parseInt(data.spots) || 0,
                perSpotPriceMonthly: parseFloat(data.perSpotPriceMonthly) || 0,
                masterLeasePrice: parseFloat(data.masterLeasePrice) || 0,
                yearlyLease: data.yearlyLease ? parseFloat(data.yearlyLease) : null,
                parcelAddress: data.parcelAddress || null,
                parcelId: data.parcelId || null,
                ownerName: data.ownerName || null,
                ownerMailingAddress: data.ownerMailingAddress || null,
                ownerContact: data.ownerContact || null,
                thumbnail: data.thumbnail || null,
                images: data.images || [],
            },
        });
        return NextResponse.json(newProposal);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const data = await req.json();
        const updatedProposal = await prisma.landlordProposal.update({
            where: { id: data.id },
            data: {
                lotName: data.lotName,
                address: data.address,
                latitude: data.latitude ? parseFloat(data.latitude) : null,
                longitude: data.longitude ? parseFloat(data.longitude) : null,
                spots: parseInt(data.spots) || 0,
                perSpotPriceMonthly: parseFloat(data.perSpotPriceMonthly) || 0,
                masterLeasePrice: parseFloat(data.masterLeasePrice) || 0,
                yearlyLease: data.yearlyLease ? parseFloat(data.yearlyLease) : null,
                parcelAddress: data.parcelAddress || null,
                parcelId: data.parcelId || null,
                ownerName: data.ownerName || null,
                ownerMailingAddress: data.ownerMailingAddress || null,
                ownerContact: data.ownerContact || null,
                thumbnail: data.thumbnail || null,
                images: data.images || [],
            },
        });
        return NextResponse.json(updatedProposal);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();
        await prisma.landlordProposal.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete proposal' }, { status: 500 });
    }
}
