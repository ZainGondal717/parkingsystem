import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const lotId = searchParams.get('lotId');
        const startDate = searchParams.get('startDate'); // ISO date string
        const endDate = searchParams.get('endDate'); // ISO date string
        const carNumber = searchParams.get('carNumber');

        const where = {};

        if (lotId && lotId !== 'all') {
            where.lotId = lotId;
        }

        if (carNumber) {
            where.carNumber = {
                contains: carNumber,
                mode: 'insensitive'
            };
        }

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                where.createdAt.gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                where.createdAt.lte = end;
            }
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                lot: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error("Fetch Bookings Error:", error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

import twilio from 'twilio';

// Initialize Twilio client once using env variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

export async function POST(req) {
    try {
        const data = await req.json();

        const newBooking = await prisma.booking.create({
            data: {
                lotId: data.lotId,
                carNumber: data.carNumber,
                phoneNumber: data.phoneNumber,
                countryCode: data.countryCode,
                durationMode: data.durationMode,
                durationValue: parseFloat(data.durationValue),
                totalPrice: parseFloat(data.totalPrice),
            },
            include: {
                lot: true
            }
        });

        // Attempt to send Twilio SMS
        if (twilioClient && newBooking.lot) {
            try {
                // Ensure proper phone number formatting (e.g. +1234567890)
                const toPhone = `${data.countryCode}${data.phoneNumber}`.trim().replace(/\s+/g, '');

                let formattedPlan = "30 Mins";
                if (data.durationMode !== 'half') {
                    const unit = data.durationMode === 'hourly' ? 'Hour' :
                        data.durationMode === 'daily' ? 'Day' :
                            data.durationMode === 'weekly' ? 'Week' : 'Month';
                    formattedPlan = `${data.durationValue} ${unit}${data.durationValue > 1 ? 's' : ''}`;
                }

                const messageBody = `🚗 Spot Reserved!\n\n📍 Location: ${newBooking.lot.name}\n🚙 Plate: ${data.carNumber}\n⏱️ Plan: ${formattedPlan}\n💰 Total: $${(typeof newBooking.totalPrice === 'number' ? newBooking.totalPrice : parseFloat(newBooking.totalPrice)).toFixed(2)}\n\nThank you!`;

                // Calculate webhook URL dynamically
                // NOTE: StatusCallback is only used in production; localhost cannot be reached by Twilio
                const APP_URL = process.env.NEXT_PUBLIC_APP_URL || (req.headers.get("origin") || `http://${req.headers.get("host")}`);
                const isLocalhost = APP_URL.includes('localhost') || APP_URL.includes('127.0.0.1');
                
                // Build Twilio message config
                const twilioMessageConfig = {
                    body: messageBody,
                    from: twilioPhoneNumber,
                    to: toPhone
                };
                
                // Only add statusCallback if not running locally
                if (!isLocalhost) {
                    twilioMessageConfig.statusCallback = `${APP_URL}/api/webhooks/twilio`;
                }

                let twilioMsg = null;
                let attempt = 0;
                let success = false;
                let lastError = null;

                // Basic Retry Logic (Try up to 2 times)
                while (attempt < 2 && !success) {
                    try {
                        twilioMsg = await twilioClient.messages.create(twilioMessageConfig);
                        success = true;
                    } catch (err) {
                        lastError = err;
                        attempt++;
                        if (attempt < 2) {
                            console.warn(`Twilio SMS failed (attempt 1). Retrying in 1 second...`);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }

                if (success && twilioMsg) {
                    console.log("Twilio SMS sent successfully, SID:", twilioMsg.sid);

                    // Create Logging Record in MongoDB
                    await prisma.smsLog.create({
                        data: {
                            bookingId: newBooking.id,
                            phone: toPhone,
                            messageSid: twilioMsg.sid,
                            deliveryStatus: twilioMsg.status || 'queued'
                        }
                    });
                } else {
                    console.error("Twilio SMS Error after retries:", lastError);
                    // Optional: Log failed attempts if desired, but we lack a valid SID here.
                }

            } catch (smsError) {
                console.error("Critical SMS System Error:", smsError);
            }
        } else {
            console.warn("Skipping Twilio SMS: Client not initialized or lot data missing. Check .env variables.");
        }

        return NextResponse.json(newBooking);
    } catch (error) {
        console.error("Create Booking Error:", error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
