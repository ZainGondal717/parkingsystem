import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
    try {
        // Twilio sends data as 'application/x-www-form-urlencoded'
        const rawBody = await req.text();
        const searchParams = new URLSearchParams(rawBody);

        const messageSid = searchParams.get('MessageSid');
        const messageStatus = searchParams.get('MessageStatus');

        if (messageSid && messageStatus) {
            console.log(`📡 Webhook Received --> SID: ${messageSid} | Status: ${messageStatus}`);

            // Update the corresponding log entry in MongoDB
            await prisma.smsLog.update({
                where: { messageSid: messageSid },
                data: { deliveryStatus: messageStatus }
            });

            return NextResponse.json({ success: true, status: 'logged' }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Missing SID or Status' }, { status: 400 });
        }
    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
