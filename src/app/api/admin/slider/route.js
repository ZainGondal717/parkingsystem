import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    try {
        const images = await prisma.sliderImage.findMany({
            where: { lot: 'A' },
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(images);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { url, publicId } = await req.json();

        const newImage = await prisma.sliderImage.create({
            data: {
                url,
                publicId,
                lot: 'A',
            },
        });

        return NextResponse.json(newImage);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id, publicId } = await req.json();

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Delete from DB
        await prisma.sliderImage.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
