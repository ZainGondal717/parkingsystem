/**
 * 🧪 LIVE TWILIO TEST ENDPOINT
 * 
 * Visit on production:
 * https://detriotparkingllc.vercel.app/api/test/twilio-admin
 * 
 * This endpoint allows testing all SMS types on live
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { 
    sendZoneCodeResponse, 
    sendBookingConfirmation,
    sendExtensionConfirmation,
    sendReminderSMS,
    isTwilioConfigured 
} from '@/lib/twilioService';

const LOG = {
    info: (msg) => console.log(`\x1b[36m[TWILIO-ADMIN]\x1b[0m 🧪 ${msg}`),
    success: (msg) => console.log(`\x1b[32m[TWILIO-ADMIN]\x1b[0m ✅ ${msg}`),
    error: (msg) => console.error(`\x1b[31m[TWILIO-ADMIN]\x1b[0m ❌ ${msg}`),
    warning: (msg) => console.log(`\x1b[33m[TWILIO-ADMIN]\x1b[0m ⚠️ ${msg}`),
};

// ✅ SECURITY: In production, you should add API key verification
// For now, this is accessible to test - remove this in production!
function checkAccess(req) {
    // In production, add proper authentication here
    // For testing purposes only - logs all accesses
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('host') || 'unknown';
    LOG.info(`Access from: ${ip}`);
    return true; // Allow all for testing
}

export async function GET(req) {
    if (!checkAccess(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    LOG.info('Admin test endpoint accessed');

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'dashboard';
    const phoneNumber = searchParams.get('phone') || '+14155552671';

    // ═══════════════════════════════════════════════════════════
    // ACTION 1: DASHBOARD (Overview)
    // ═══════════════════════════════════════════════════════════
    if (action === 'dashboard') {
        const configured = isTwilioConfigured();
        
        LOG.success('Dashboard viewed');

        return NextResponse.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            twilio: {
                configured,
                accountSid: configured ? `${process.env.TWILIO_ACCOUNT_SID.slice(0, 4)}...` : 'NOT SET',
                phoneNumber: process.env.TWILIO_PHONE_NUMBER || 'NOT SET'
            },
            availableTests: [
                {
                    name: 'Configuration Status',
                    url: '?action=status'
                },
                {
                    name: 'Send Zone Code SMS',
                    url: '?action=send-zone&phone=%2B14155552671'
                },
                {
                    name: 'Send Booking Confirmation',
                    url: '?action=send-booking&phone=%2B14155552671'
                },
                {
                    name: 'Send Extension SMS',
                    url: '?action=send-extension&phone=%2B14155552671'
                },
                {
                    name: 'Send 10-Min Reminder',
                    url: '?action=send-reminder&phone=%2B14155552671'
                },
                {
                    name: 'View Recent SMS Logs',
                    url: '?action=logs&limit=10'
                },
                {
                    name: 'View Logs for Booking',
                    url: '?action=booking-logs&bookingId=BOOKING_ID'
                }
            ],
            instructions: [
                'Replace 14155552671 with your phone number',
                'Check Vercel logs to see [TWILIO-ADMIN] and [TWILIO] messages',
                'Each test will log to database and Vercel'
            ]
        });
    }

    // ═══════════════════════════════════════════════════════════
    // ACTION 2: STATUS CHECK
    // ═══════════════════════════════════════════════════════════
    if (action === 'status') {
        LOG.info('Status check requested');

        if (!isTwilioConfigured()) {
            LOG.error('Twilio not configured');
            return NextResponse.json({
                status: 'ERROR',
                configured: false,
                missing: {
                    TWILIO_ACCOUNT_SID: !process.env.TWILIO_ACCOUNT_SID,
                    TWILIO_AUTH_TOKEN: !process.env.TWILIO_AUTH_TOKEN,
                    TWILIO_PHONE_NUMBER: !process.env.TWILIO_PHONE_NUMBER
                },
                nextStep: 'Add missing environment variables to Vercel'
            });
        }

        LOG.success('Twilio is configured');
        return NextResponse.json({
            status: 'OK',
            configured: true,
            config: {
                TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID.slice(0, 4) + '...' + process.env.TWILIO_ACCOUNT_SID.slice(-4),
                TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER
            },
            message: 'Twilio is properly configured and ready!'
        });
    }

    // ═══════════════════════════════════════════════════════════
    // ACTION 3: SEND ZONE CODE SMS
    // ═══════════════════════════════════════════════════════════
    if (action === 'send-zone') {
        LOG.info(`Sending zone code SMS to ${phoneNumber}`);
        
        try {
            const result = await sendZoneCodeResponse({
                to: phoneNumber,
                lotName: 'Test Parking Lot',
                lotId: 'test-lot-001',
                headers: req.headers
            });

            if (result.success) {
                LOG.success(`Zone SMS sent: ${result.messageSid}`);
                return NextResponse.json({
                    status: 'SUCCESS',
                    messageType: 'ZONE_CODE',
                    messageSid: result.messageSid,
                    phoneNumber,
                    message: 'Zone code SMS sent successfully!',
                    nextStep: 'Check phone for SMS and Vercel logs'
                });
            } else {
                LOG.error(`Zone SMS failed: ${result.error}`);
                return NextResponse.json({
                    status: 'FAILED',
                    error: result.error
                }, { status: 400 });
            }
        } catch (err) {
            LOG.error(`Exception: ${err.message}`);
            return NextResponse.json({ status: 'ERROR', error: err.message }, { status: 500 });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // ACTION 4: SEND BOOKING CONFIRMATION
    // ═══════════════════════════════════════════════════════════
    if (action === 'send-booking') {
        LOG.info(`Sending booking confirmation to ${phoneNumber}`);
        
        try {
            const mockBooking = {
                id: 'test-' + Date.now(),
                carNumber: 'TEST123',
                phoneNumber: phoneNumber.replace(/^\+1/, ''),
                countryCode: '+1',
                slotNumber: 5,
                durationMode: 'hourly',
                durationValue: 2,
                totalPrice: 29.99
            };

            const mockLot = { name: 'Downtown Lot A' };

            const result = await sendBookingConfirmation({
                booking: mockBooking,
                lot: mockLot,
                headers: req.headers
            });

            if (result.success) {
                LOG.success(`Booking SMS sent: ${result.messageSid}`);
                return NextResponse.json({
                    status: 'SUCCESS',
                    messageType: 'BOOKING_CONFIRMATION',
                    messageSid: result.messageSid,
                    phoneNumber,
                    testData: mockBooking,
                    message: 'Booking confirmation SMS sent!'
                });
            } else {
                LOG.error(`Booking SMS failed: ${result.error}`);
                return NextResponse.json({ status: 'FAILED', error: result.error }, { status: 400 });
            }
        } catch (err) {
            LOG.error(`Exception: ${err.message}`);
            return NextResponse.json({ status: 'ERROR', error: err.message }, { status: 500 });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // ACTION 5: SEND EXTENSION SMS
    // ═══════════════════════════════════════════════════════════
    if (action === 'send-extension') {
        LOG.info(`Sending extension SMS to ${phoneNumber}`);
        
        try {
            const mockBooking = {
                id: 'ext-' + Date.now(),
                carNumber: 'EXT456',
                phoneNumber: phoneNumber.replace(/^\+1/, ''),
                countryCode: '+1',
                slotNumber: 3,
                totalPrice: 44.99
            };

            const mockLot = { name: 'Airport Lot B' };

            const result = await sendExtensionConfirmation({
                booking: mockBooking,
                lot: mockLot,
                additionalDurationValue: 1,
                additionalDurationMode: 'hourly',
                headers: req.headers
            });

            if (result.success) {
                LOG.success(`Extension SMS sent: ${result.messageSid}`);
                return NextResponse.json({
                    status: 'SUCCESS',
                    messageType: 'BOOKING_EXTENSION',
                    messageSid: result.messageSid,
                    phoneNumber,
                    message: 'Extension SMS sent!'
                });
            } else {
                LOG.error(`Extension SMS failed: ${result.error}`);
                return NextResponse.json({ status: 'FAILED', error: result.error }, { status: 400 });
            }
        } catch (err) {
            LOG.error(`Exception: ${err.message}`);
            return NextResponse.json({ status: 'ERROR', error: err.message }, { status: 500 });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // ACTION 6: SEND 10-MINUTE REMINDER
    // ═══════════════════════════════════════════════════════════
    if (action === 'send-reminder') {
        LOG.info(`Sending reminder SMS to ${phoneNumber}`);
        
        try {
            const mockBooking = {
                id: 'rem-' + Date.now(),
                carNumber: 'REM789',
                phoneNumber: phoneNumber.replace(/^\+1/, ''),
                countryCode: '+1',
                slotNumber: 7,
                durationMode: 'hourly',
                durationValue: 1,
                createdAt: new Date(Date.now() - 50 * 60 * 1000)
            };

            const mockLot = { name: 'Downtown Lot C' };

            const result = await sendReminderSMS({
                booking: mockBooking,
                lot: mockLot,
                headers: req.headers
            });

            if (result.success) {
                LOG.success(`Reminder SMS sent: ${result.messageSid}`);
                return NextResponse.json({
                    status: 'SUCCESS',
                    messageType: 'REMINDER_10MIN',
                    messageSid: result.messageSid,
                    phoneNumber,
                    message: '10-minute reminder SMS sent!'
                });
            } else {
                LOG.error(`Reminder SMS failed: ${result.error}`);
                return NextResponse.json({ status: 'FAILED', error: result.error }, { status: 400 });
            }
        } catch (err) {
            LOG.error(`Exception: ${err.message}`);
            return NextResponse.json({ status: 'ERROR', error: err.message }, { status: 500 });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // ACTION 7: VIEW SMS LOGS
    // ═══════════════════════════════════════════════════════════
    if (action === 'logs') {
        try {
            const limit = parseInt(searchParams.get('limit')) || 20;
            LOG.info(`Fetching ${limit} SMS logs`);

            const logs = await prisma.smsLog.findMany({
                orderBy: { timestamp: 'desc' },
                take: limit,
                include: {
                    booking: {
                        select: {
                            carNumber: true,
                            lot: { select: { name: true } }
                        }
                    }
                }
            });

            LOG.success(`Retrieved ${logs.length} SMS logs`);

            return NextResponse.json({
                status: 'OK',
                totalLogs: logs.length,
                logs: logs.map(log => ({
                    messageSid: log.messageSid,
                    messageType: log.messageType,
                    phone: log.phone,
                    deliveryStatus: log.deliveryStatus,
                    timestamp: log.timestamp,
                    booking: log.booking ? {
                        carNumber: log.booking.carNumber,
                        lot: log.booking.lot?.name
                    } : null,
                    messagePreview: log.messageBody?.substring(0, 100) + '...' || 'N/A'
                }))
            });
        } catch (err) {
            LOG.error(`Failed to fetch logs: ${err.message}`);
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // ACTION 8: VIEW BOOKING-SPECIFIC LOGS
    // ═══════════════════════════════════════════════════════════
    if (action === 'booking-logs') {
        const bookingId = searchParams.get('bookingId');
        if (!bookingId) {
            return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
        }

        try {
            LOG.info(`Fetching logs for booking: ${bookingId}`);

            const logs = await prisma.smsLog.findMany({
                where: { bookingId },
                orderBy: { timestamp: 'desc' },
                include: {
                    booking: {
                        select: {
                            carNumber: true,
                            lot: { select: { name: true } },
                            durationMode: true,
                            durationValue: true
                        }
                    }
                }
            });

            LOG.success(`Retrieved ${logs.length} logs for booking`);

            return NextResponse.json({
                status: 'OK',
                bookingId,
                totalSmsCount: logs.length,
                messages: logs.map(log => ({
                    type: log.messageType,
                    status: log.deliveryStatus,
                    sentAt: log.timestamp,
                    phone: log.phone,
                    messagePreview: log.messageBody?.substring(0, 150)
                })),
                booking: logs[0]?.booking || null
            });
        } catch (err) {
            LOG.error(`Failed to fetch booking logs: ${err.message}`);
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }

    // Default: Show main dashboard
    return NextResponse.json({
        message: 'Use ?action=dashboard for full interface'
    });
}
