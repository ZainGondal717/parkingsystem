import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const proposal = await prisma.landlordProposal.findUnique({
            where: { id }
        });
        if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(proposal);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 });
    }
}
