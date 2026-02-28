import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

export async function GET(req) {
    try {
        const now = new Date();
        const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
        const elevenMinutesFromNow = new Date(now.getTime() + 11 * 60 * 1000);

        // Fetch all bookings that haven't sent a notification yet
        // We need to check if their expiry time is within the next 10 minutes
        const bookings = await prisma.booking.findMany({
            where: {
                notificationSent: false,
            },
            include: {
                lot: true
            }
        });

        let sentCount = 0;
        const APP_URL = process.env.NEXT_PUBLIC_APP_URL || `http://${req.headers.get("host")}`;

        for (const booking of bookings) {
            // Calculate expiry
            const start = new Date(booking.createdAt);
            let endMs = start.getTime();
            const value = booking.durationValue || 0;
            switch (booking.durationMode) {
                case 'half': endMs += (30 * 60 * 1000); break;
                case 'hourly': endMs += (value * 60 * 60 * 1000); break;
                case 'daily': endMs += (value * 24 * 60 * 60 * 1000); break;
                case 'weekly': endMs += (value * 7 * 24 * 60 * 60 * 1000); break;
                case 'monthly':
                    const endObj = new Date(start);
                    endObj.setMonth(start.getMonth() + Math.floor(value));
                    endMs = endObj.getTime();
                    break;
            }

            const timeUntilExpiry = endMs - now.getTime();
            const tenMinsInMs = 10 * 60 * 1000;
            const twelveMinsInMs = 12 * 60 * 1000;

            // If expiry is between 0 and 10 minutes away (or specifically around 10)
            if (timeUntilExpiry > 0 && timeUntilExpiry <= tenMinsInMs) {
                if (twilioClient) {
                    const toPhone = `${booking.countryCode}${booking.phoneNumber}`.trim().replace(/\s+/g, '');
                    const extensionLink = `${APP_URL}/?extend=${booking.id}`;

                    const messageBody = `⚠️ 10 MINUTES LEFT!\n\nYour parking at ${booking.lot.name} (Slot #${booking.slotNumber}) expires soon.\n\nClick here to increase your time:\n${extensionLink}\n\nIf you have already left, please ignore this message.`;

                    try {
                        await twilioClient.messages.create({
                            body: messageBody,
                            from: twilioPhoneNumber,
                            to: toPhone
                        });

                        // Mark as sent
                        await prisma.booking.update({
                            where: { id: booking.id },
                            data: { notificationSent: true }
                        });
                        sentCount++;
                    } catch (err) {
                        console.error(`Failed to send reminder to ${toPhone}:`, err);
                    }
                }
            }
        }

        return NextResponse.json({ success: true, notificationsSent: sentCount });
    } catch (error) {
        console.error("Cron Notification Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
