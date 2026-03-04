/**
 * 🔔 TWILIO SMS SERVICE
 * Centralized service for all Twilio SMS operations with comprehensive logging.
 * 
 * MESSAGE TYPES:
 * - ZONE_CODE: When user texts zone code, reply with booking link
 * - BOOKING_CONFIRMATION: When new booking is created
 * - BOOKING_EXTENSION: When booking time is extended
 * - REMINDER_10MIN: 10 minutes before booking expires
 * - CUSTOM: For any other messages
 */

import twilio from 'twilio';
import prisma from '@/lib/prisma';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

// Message types for logging
export const SMS_TYPES = {
    ZONE_CODE: 'ZONE_CODE',
    BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',
    BOOKING_EXTENSION: 'BOOKING_EXTENSION',
    REMINDER_10MIN: 'REMINDER_10MIN',
    CUSTOM: 'CUSTOM'
};

// Color codes for console logging
const LOG_COLORS = {
    INFO: '\x1b[36m',      // Cyan
    SUCCESS: '\x1b[32m',   // Green
    WARNING: '\x1b[33m',   // Yellow
    ERROR: '\x1b[31m',     // Red
    RESET: '\x1b[0m',      // Reset
    BOLD: '\x1b[1m',       // Bold
    DIM: '\x1b[2m'         // Dim
};

/**
 * Log helper for consistent formatting
 */
const log = {
    info: (emoji, message, data = null) => {
        console.log(`${LOG_COLORS.INFO}[TWILIO]${LOG_COLORS.RESET} ${emoji} ${message}`);
        if (data) console.log(`${LOG_COLORS.DIM}         └─ Data:${LOG_COLORS.RESET}`, JSON.stringify(data, null, 2));
    },
    success: (emoji, message, data = null) => {
        console.log(`${LOG_COLORS.SUCCESS}[TWILIO]${LOG_COLORS.RESET} ${emoji} ${message}`);
        if (data) console.log(`${LOG_COLORS.DIM}         └─ Data:${LOG_COLORS.RESET}`, JSON.stringify(data, null, 2));
    },
    warning: (emoji, message, data = null) => {
        console.log(`${LOG_COLORS.WARNING}[TWILIO]${LOG_COLORS.RESET} ${emoji} ${message}`);
        if (data) console.log(`${LOG_COLORS.DIM}         └─ Data:${LOG_COLORS.RESET}`, JSON.stringify(data, null, 2));
    },
    error: (emoji, message, error = null) => {
        console.error(`${LOG_COLORS.ERROR}[TWILIO]${LOG_COLORS.RESET} ${emoji} ${message}`);
        if (error) console.error(`${LOG_COLORS.DIM}         └─ Error:${LOG_COLORS.RESET}`, error.message || error);
    },
    separator: () => {
        console.log(`${LOG_COLORS.DIM}${'─'.repeat(60)}${LOG_COLORS.RESET}`);
    }
};

/**
 * Check if Twilio is properly configured
 */
export function isTwilioConfigured() {
    const configured = !!twilioClient;
    if (!configured) {
        log.error('⚠️', 'Twilio client not initialized. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env');
    }
    return configured;
}

/**
 * Format phone number for Twilio (ensure proper E.164 format)
 */
export function formatPhoneNumber(countryCode, phoneNumber) {
    const formatted = `${countryCode}${phoneNumber}`.trim().replace(/\s+/g, '').replace(/[^+\d]/g, '');
    log.info('📞', `Formatted phone: ${formatted}`);
    return formatted;
}

/**
 * Get webhook URL for status callbacks
 */
function getWebhookUrl(headers) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   (headers?.get?.("origin")) || 
                   (headers?.get?.("host") ? `http://${headers.get("host")}` : null);
    
    // Don't send webhook URL in localhost (Twilio can't reach it)
    if (appUrl && (appUrl.includes('localhost') || appUrl.includes('127.0.0.1'))) {
        log.warning('🏠', 'Running on localhost - status callbacks disabled');
        return null;
    }
    
    return appUrl ? `${appUrl}/api/webhooks/twilio` : null;
}

/**
 * Send SMS with retry logic and logging
 */
export async function sendSMS({ to, body, type = SMS_TYPES.CUSTOM, bookingId = null, headers = null, retries = 2 }) {
    log.separator();
    log.info('📤', `SENDING SMS [${type}]`);
    log.info('📱', `To: ${to}`);
    log.info('📝', `Message: ${body.substring(0, 100)}${body.length > 100 ? '...' : ''}`);
    
    if (!isTwilioConfigured()) {
        return { success: false, error: 'Twilio not configured' };
    }

    const webhookUrl = getWebhookUrl(headers);
    const messageConfig = {
        body,
        from: twilioPhoneNumber,
        to
    };

    if (webhookUrl) {
        messageConfig.statusCallback = webhookUrl;
        log.info('🔗', `Status callback: ${webhookUrl}`);
    }

    let lastError = null;
    let attempt = 0;

    while (attempt < retries) {
        attempt++;
        log.info('🔄', `Attempt ${attempt}/${retries}...`);

        try {
            const message = await twilioClient.messages.create(messageConfig);
            
            log.success('✅', `SMS SENT SUCCESSFULLY!`);
            log.success('🆔', `Message SID: ${message.sid}`);
            log.success('📊', `Status: ${message.status}`);

            // Log to database - bookingId is optional
            try {
                const logData = {
                    phone: to,
                    messageSid: message.sid,
                    deliveryStatus: message.status || 'queued',
                    messageType: type,
                    messageBody: body.substring(0, 500) // Limit body length
                };
                
                if (bookingId) {
                    logData.bookingId = bookingId;
                }

                await prisma.smsLog.create({ data: logData });
                log.success('💾', 'SMS logged to database');
            } catch (dbError) {
                log.warning('⚠️', 'Failed to log SMS to database (non-critical)', dbError);
            }

            log.separator();
            return {
                success: true,
                messageSid: message.sid,
                status: message.status
            };

        } catch (error) {
            lastError = error;
            log.error('❌', `Attempt ${attempt} failed: ${error.message}`);
            
            if (attempt < retries) {
                log.info('⏳', 'Waiting 1 second before retry...');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    log.error('💥', `SMS FAILED after ${retries} attempts`);
    log.separator();
    
    return {
        success: false,
        error: lastError?.message || 'Unknown error'
    };
}

/**
 * Send Zone Code Response - When user texts a zone code, send booking link
 */
export async function sendZoneCodeResponse({ to, lotName, lotId, headers = null }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://detriotparkingllc.vercel.app';
    const bookingLink = `${baseUrl}/book-parking?lot=${lotId}`;

    const body = `🅿️ Welcome to ${lotName}!\n\nTo book a parking spot, tap the link below:\n\n${bookingLink}\n\nDetroit Parking LLC`;

    log.info('📍', `Zone code response for lot: ${lotName}`);

    return sendSMS({
        to,
        body,
        type: SMS_TYPES.ZONE_CODE,
        headers
    });
}

/**
 * Send Booking Confirmation SMS
 */
export async function sendBookingConfirmation({ booking, lot, headers = null }) {
    const toPhone = formatPhoneNumber(booking.countryCode, booking.phoneNumber);
    
    let formattedPlan = "30 Mins";
    if (booking.durationMode !== 'half') {
        const unit = booking.durationMode === 'hourly' ? 'Hour' :
            booking.durationMode === 'daily' ? 'Day' :
            booking.durationMode === 'weekly' ? 'Week' : 'Month';
        formattedPlan = `${booking.durationValue} ${unit}${booking.durationValue > 1 ? 's' : ''}`;
    }

    const totalPrice = typeof booking.totalPrice === 'number' 
        ? booking.totalPrice.toFixed(2) 
        : parseFloat(booking.totalPrice).toFixed(2);

    const body = `🚗 Spot Reserved!\n\n📍 Location: ${lot.name}\n🚙 Plate: ${booking.carNumber}\n🔢 Slot: #${booking.slotNumber}\n⏱️ Plan: ${formattedPlan}\n💰 Total: $${totalPrice}\n\nThank you for choosing Detroit Parking!`;

    log.info('🎫', `Booking confirmation for: ${booking.carNumber}`);

    return sendSMS({
        to: toPhone,
        body,
        type: SMS_TYPES.BOOKING_CONFIRMATION,
        bookingId: booking.id,
        headers
    });
}

/**
 * Send Booking Extension Confirmation SMS
 */
export async function sendExtensionConfirmation({ booking, lot, additionalDurationValue, additionalDurationMode, headers = null }) {
    const toPhone = formatPhoneNumber(booking.countryCode, booking.phoneNumber);
    
    const totalPrice = typeof booking.totalPrice === 'number' 
        ? booking.totalPrice.toFixed(2) 
        : parseFloat(booking.totalPrice).toFixed(2);

    const body = `✅ Session Extended!\n\n📍 Location: ${lot.name}\n🔢 Slot: #${booking.slotNumber}\n⏱️ Additional: ${additionalDurationValue} ${additionalDurationMode}${parseFloat(additionalDurationValue) > 1 ? 's' : ''}\n💰 New Total: $${totalPrice}\n\nThank you!`;

    log.info('⏰', `Extension confirmation for: ${booking.carNumber}`);

    return sendSMS({
        to: toPhone,
        body,
        type: SMS_TYPES.BOOKING_EXTENSION,
        bookingId: booking.id,
        headers
    });
}

/**
 * Send 10-Minute Reminder SMS with extension link
 */
export async function sendReminderSMS({ booking, lot, headers = null }) {
    const toPhone = formatPhoneNumber(booking.countryCode, booking.phoneNumber);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://detriotparkingllc.vercel.app';
    const extensionLink = `${baseUrl}/book-parking?extend=${booking.id}`;

    const body = `⚠️ 10 MINUTES LEFT!\n\nYour parking at ${lot.name} (Slot #${booking.slotNumber}) expires soon.\n\n🔗 Click here to extend your time:\n${extensionLink}\n\nIf you have already left, please ignore this message.`;

    log.info('⏰', `10-minute reminder for: ${booking.carNumber}`);

    return sendSMS({
        to: toPhone,
        body,
        type: SMS_TYPES.REMINDER_10MIN,
        bookingId: booking.id,
        headers
    });
}

/**
 * Parse incoming SMS for zone code
 * Returns lot info if zone code matches, null otherwise
 */
export async function parseZoneCode(messageBody) {
    const code = messageBody.trim().toUpperCase();
    log.info('🔍', `Parsing zone code: "${code}"`);

    // Try to find a lot by name or a specific zone code field
    // First, try to find by lot name (case-insensitive partial match)
    const lots = await prisma.parkingLot.findMany();
    
    // Look for a lot whose name contains the code
    let matchedLot = lots.find(lot => 
        lot.name.toUpperCase().includes(code) || 
        code.includes(lot.name.toUpperCase().replace(/\s+/g, ''))
    );

    // Also try matching by lot ID (if someone sends the ID)
    if (!matchedLot) {
        matchedLot = lots.find(lot => lot.id === code || lot.id.toUpperCase() === code);
    }

    // Also try matching "PARK A", "LOT A", etc.
    if (!matchedLot) {
        const codePattern = code.replace(/^(PARK|LOT|ZONE)\s*/i, '');
        matchedLot = lots.find(lot => 
            lot.name.toUpperCase().includes(codePattern) ||
            lot.name.toUpperCase().replace(/\s+/g, '') === codePattern
        );
    }

    if (matchedLot) {
        log.success('✅', `Zone code matched: ${matchedLot.name}`);
        return matchedLot;
    }

    log.warning('❌', `No lot found for zone code: "${code}"`);
    return null;
}

/**
 * Handle incoming SMS (process zone codes)
 */
export async function handleIncomingSMS({ from, body, headers = null }) {
    log.separator();
    log.info('📥', 'INCOMING SMS RECEIVED');
    log.info('📱', `From: ${from}`);
    log.info('📝', `Body: ${body}`);

    // Try to parse as zone code
    const lot = await parseZoneCode(body);

    if (lot) {
        // Send booking link for this lot
        const result = await sendZoneCodeResponse({
            to: from,
            lotName: lot.name,
            lotId: lot.id,
            headers
        });
        return { handled: true, type: 'ZONE_CODE', lot: lot.name, result };
    }

    // Check if it's a "STOP" or other opt-out message
    const optOutKeywords = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'QUIT', 'END'];
    if (optOutKeywords.includes(body.toUpperCase().trim())) {
        log.info('🛑', 'Opt-out message received - no response sent');
        return { handled: true, type: 'OPT_OUT' };
    }

    // Unknown message - send help response
    log.info('❓', 'Unknown message - sending help response');
    
    const helpBody = `🅿️ Detroit Parking LLC\n\nTo book parking, text the lot name or scan the QR code at any of our locations.\n\nNeed help? Call us or visit our website.`;
    
    await sendSMS({
        to: from,
        body: helpBody,
        type: SMS_TYPES.CUSTOM,
        headers
    });

    return { handled: true, type: 'HELP_RESPONSE' };
}

/**
 * Update SMS delivery status from webhook
 */
export async function updateDeliveryStatus(messageSid, status) {
    log.separator();
    log.info('📡', 'WEBHOOK STATUS UPDATE');
    log.info('🆔', `Message SID: ${messageSid}`);
    log.info('📊', `Status: ${status}`);

    try {
        // Map Twilio status to our status
        const statusMap = {
            'queued': 'queued',
            'sent': 'sent',
            'delivered': 'delivered',
            'undelivered': 'failed',
            'failed': 'failed',
            'read': 'delivered'
        };

        const mappedStatus = statusMap[status] || status;

        const updated = await prisma.smsLog.updateMany({
            where: { messageSid },
            data: { deliveryStatus: mappedStatus }
        });

        if (updated.count > 0) {
            log.success('✅', `Delivery status updated: ${mappedStatus}`);
        } else {
            log.warning('⚠️', `No SMS log found for SID: ${messageSid}`);
        }

        log.separator();
        return { success: true, updated: updated.count };

    } catch (error) {
        log.error('❌', 'Failed to update delivery status', error);
        log.separator();
        return { success: false, error: error.message };
    }
}

/**
 * Get SMS log summary for debugging
 */
export async function getSmsLogSummary(bookingId = null) {
    const where = bookingId ? { bookingId } : {};
    
    const logs = await prisma.smsLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: 50,
        include: {
            booking: {
                select: {
                    carNumber: true,
                    lot: {
                        select: { name: true }
                    }
                }
            }
        }
    });

    log.info('📊', `Found ${logs.length} SMS logs`);
    return logs;
}

export default {
    SMS_TYPES,
    isTwilioConfigured,
    formatPhoneNumber,
    sendSMS,
    sendZoneCodeResponse,
    sendBookingConfirmation,
    sendExtensionConfirmation,
    sendReminderSMS,
    parseZoneCode,
    handleIncomingSMS,
    updateDeliveryStatus,
    getSmsLogSummary
};
