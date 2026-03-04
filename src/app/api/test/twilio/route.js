import { NextResponse } from 'next/server';
import { 
    sendZoneCodeResponse, 
    sendBookingConfirmation,
    sendReminderSMS,
    isTwilioConfigured 
} from '@/lib/twilioService';

/**
 * 🧪 TEST ENDPOINT FOR TWILIO
 * 
 * Use this to verify Twilio is working locally
 * Access: http://localhost:3000/api/test/twilio
 */

const LOG = {
    info: (msg) => console.log(`\x1b[36m[TWILIO-TEST]\x1b[0m 🧪 ${msg}`),
    success: (msg) => console.log(`\x1b[32m[TWILIO-TEST]\x1b[0m ✅ ${msg}`),
    error: (msg) => console.error(`\x1b[31m[TWILIO-TEST]\x1b[0m ❌ ${msg}`),
};

export async function GET(req) {
    LOG.info('Test endpoint accessed');

    const { searchParams } = new URL(req.url);
    const testType = searchParams.get('test') || 'status';
    const phoneNumber = searchParams.get('phone') || '+1234567890'; // Test number

    // Check if Twilio is configured
    if (!isTwilioConfigured()) {
        return NextResponse.json({
            status: 'ERROR',
            message: 'Twilio not configured!',
            setup: {
                step1: 'Check .env file has:',
                TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? '✅ SET' : '❌ MISSING',
                TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? '✅ SET' : '❌ MISSING',
                TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ? '✅ SET' : '❌ MISSING'
            }
        }, { status: 400 });
    }

    try {
        // Test 1: Status Check
        if (testType === 'status') {
            LOG.success('Running status check...');
            return NextResponse.json({
                status: 'OK',
                message: 'Twilio is properly configured!',
                config: {
                    TWILIO_ACCOUNT_SID: `${process.env.TWILIO_ACCOUNT_SID.slice(0, 4)}...${process.env.TWILIO_ACCOUNT_SID.slice(-4)}`,
                    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
                    TWILIO_AUTH_TOKEN: '***HIDDEN***'
                },
                nextSteps: [
                    '1. Update Twilio Console with your ngrok URL',
                    '2. Use ?test=zone&phone=+12345 to test zone code',
                    '3. Use ?test=booking&phone=+12345 to test booking confirmation'
                ]
            });
        }

        // Test 2: Zone Code Response
        if (testType === 'zone') {
            LOG.success('Testing zone code response...');
            
            const result = await sendZoneCodeResponse({
                to: phoneNumber,
                lotName: 'Test Lot A',
                lotId: 'test-lot-123',
                headers: req.headers
            });

            if (result.success) {
                LOG.success(`Zone code SMS sent! SID: ${result.messageSid}`);
                return NextResponse.json({
                    status: 'SUCCESS',
                    message: 'Zone code SMS sent!',
                    details: {
                        messageSid: result.messageSid,
                        phoneNumber: phoneNumber,
                        messageType: 'ZONE_CODE',
                        nextCheck: 'Check your console logs below'
                    },
                    consoleOutput: 'Check your terminal/console for [TWILIO] logs'
                });
            } else {
                LOG.error(`Failed: ${result.error}`);
                return NextResponse.json({
                    status: 'FAILED',
                    message: result.error
                }, { status: 400 });
            }
        }

        // Test 3: Booking Confirmation
        if (testType === 'booking') {
            LOG.success('Testing booking confirmation...');
            
            const mockBooking = {
                id: 'test-booking-123',
                carNumber: 'ABC123',
                phoneNumber: phoneNumber.replace(/^\+1/, ''), // Strip country code
                countryCode: '+1',
                slotNumber: 5,
                durationMode: 'hourly',
                durationValue: 1,
                totalPrice: 15.99,
                createdAt: new Date()
            };

            const mockLot = {
                id: 'lot-123',
                name: 'Test Parking Lot A'
            };

            const result = await sendBookingConfirmation({
                booking: mockBooking,
                lot: mockLot,
                headers: req.headers
            });

            if (result.success) {
                LOG.success(`Booking SMS sent! SID: ${result.messageSid}`);
                return NextResponse.json({
                    status: 'SUCCESS',
                    message: 'Booking confirmation SMS sent!',
                    details: {
                        messageSid: result.messageSid,
                        phoneNumber: phoneNumber,
                        messageType: 'BOOKING_CONFIRMATION',
                        mockData: mockBooking
                    }
                });
            } else {
                LOG.error(`Failed: ${result.error}`);
                return NextResponse.json({
                    status: 'FAILED',
                    message: result.error
                }, { status: 400 });
            }
        }

        // Test 4: 10-Minute Reminder
        if (testType === 'reminder') {
            LOG.success('Testing 10-minute reminder...');
            
            const mockBooking = {
                id: 'test-booking-123',
                carNumber: 'XYZ789',
                phoneNumber: phoneNumber.replace(/^\+1/, ''),
                countryCode: '+1',
                slotNumber: 3,
                durationMode: 'hourly',
                durationValue: 2,
                createdAt: new Date(Date.now() - 50 * 60 * 1000) // Created 50 mins ago
            };

            const mockLot = {
                name: 'Downtown Parking'
            };

            const result = await sendReminderSMS({
                booking: mockBooking,
                lot: mockLot,
                headers: req.headers
            });

            if (result.success) {
                LOG.success(`Reminder SMS sent! SID: ${result.messageSid}`);
                return NextResponse.json({
                    status: 'SUCCESS',
                    message: '10-minute reminder SMS sent!',
                    details: {
                        messageSid: result.messageSid,
                        phoneNumber: phoneNumber,
                        messageType: 'REMINDER_10MIN'
                    }
                });
            } else {
                LOG.error(`Failed: ${result.error}`);
                return NextResponse.json({
                    status: 'FAILED',
                    message: result.error
                }, { status: 400 });
            }
        }

        // Default: Show test options
        return NextResponse.json({
            status: 'OK',
            message: 'Twilio Test Endpoint Available',
            availableTests: {
                status: 'http://localhost:3000/api/test/twilio?test=status',
                zone: 'http://localhost:3000/api/test/twilio?test=zone&phone=%2B1234567890',
                booking: 'http://localhost:3000/api/test/twilio?test=booking&phone=%2B1234567890',
                reminder: 'http://localhost:3000/api/test/twilio?test=reminder&phone=%2B1234567890'
            },
            instructions: {
                step1: 'Verify status first',
                step2: 'Check console for [TWILIO] colored logs',
                step3: 'Use real phone number with ?phone=+1234567890'
            }
        });

    } catch (error) {
        LOG.error(`Exception: ${error.message}`);
        return NextResponse.json({
            status: 'ERROR',
            message: error.message
        }, { status: 500 });
    }
}
