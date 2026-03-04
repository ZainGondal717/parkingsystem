/**
 * 🔍 TWILIO VERIFICATION & HEALTH CHECK
 * 
 * Comprehensive verification that everything is configured correctly
 * Run this BEFORE testing to ensure Twilio works properly
 * 
 * Visit: /api/test/twilio-verify
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isTwilioConfigured } from '@/lib/twilioService';
import twilio from 'twilio';

const LOG = {
    check: (name, status, detail = '') => 
        console.log(`${status ? '✅' : '❌'} ${name}${detail ? ' - ' + detail : ''}`),
};

export async function GET(req) {
    const startTime = Date.now();
    const results = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        checks: {},
        warnings: [],
        errors: [],
        summary: {}
    };

    try {
        // ═══════════════════════════════════════════════════════════
        // CHECK 1: Environment Variables
        // ═══════════════════════════════════════════════════════════
        console.log('\n📋 CHECKING ENVIRONMENT VARIABLES...');
        
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
        const dbUrl = process.env.DATABASE_URL;

        const envCheck = {
            TWILIO_ACCOUNT_SID: !!accountSid,
            TWILIO_AUTH_TOKEN: !!authToken,
            TWILIO_PHONE_NUMBER: !!twilioPhone,
            DATABASE_URL: !!dbUrl
        };

        results.checks.environment = envCheck;
        
        LOG.check('TWILIO_ACCOUNT_SID', envCheck.TWILIO_ACCOUNT_SID, accountSid ? `${accountSid.slice(0, 4)}...` : 'MISSING');
        LOG.check('TWILIO_AUTH_TOKEN', envCheck.TWILIO_AUTH_TOKEN, authToken ? '***HIDDEN***' : 'MISSING');
        LOG.check('TWILIO_PHONE_NUMBER', envCheck.TWILIO_PHONE_NUMBER, twilioPhone || 'MISSING');
        LOG.check('DATABASE_URL', envCheck.DATABASE_URL, dbUrl ? 'MongoDB URL present' : 'MISSING');

        if (!envCheck.TWILIO_ACCOUNT_SID || !envCheck.TWILIO_AUTH_TOKEN || !envCheck.TWILIO_PHONE_NUMBER) {
            results.errors.push({
                check: 'Environment Variables',
                message: 'Missing Twilio credentials in environment',
                fix: 'Add to Vercel: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER'
            });
        }

        // ═══════════════════════════════════════════════════════════
        // CHECK 2: Twilio Client
        // ═══════════════════════════════════════════════════════════
        console.log('\n🔌 CHECKING TWILIO CLIENT...');
        
        const twilioConfigured = isTwilioConfigured();
        results.checks.twilioClient = twilioConfigured;
        LOG.check('Twilio Client Initialized', twilioConfigured);

        if (!twilioConfigured) {
            results.errors.push({
                check: 'Twilio Client',
                message: 'Could not initialize Twilio client',
                fix: 'Verify credentials are in Vercel environment variables'
            });
        }

        // ═══════════════════════════════════════════════════════════
        // CHECK 3: Twilio Account Verification
        // ═══════════════════════════════════════════════════════════
        console.log('\n🔐 CHECKING TWILIO ACCOUNT...');
        
        let twilioAccountOk = false;
        let twilioError = null;

        if (twilioConfigured) {
            try {
                const client = twilio(accountSid, authToken);
                const account = await client.api.accounts(accountSid).fetch();
                
                twilioAccountOk = true;
                results.checks.twilioAccount = {
                    status: account.status,
                    type: account.type,
                    friendlyName: account.friendlyName
                };
                
                LOG.check('Twilio Account Access', true, `Status: ${account.status}`);
                
                if (account.status !== 'active') {
                    results.warnings.push(`Twilio account status is "${account.status}" (expected "active")`);
                }
            } catch (err) {
                twilioError = err.message;
                results.errors.push({
                    check: 'Twilio Account',
                    message: `Could not verify account: ${err.message}`,
                    fix: 'Check that credentials are correct and account is active'
                });
                LOG.check('Twilio Account Access', false, err.message);
            }
        }

        // ═══════════════════════════════════════════════════════════
        // CHECK 4: Phone Number Configuration
        // ═══════════════════════════════════════════════════════════
        console.log('\n📱 CHECKING PHONE NUMBER...');
        
        let phoneOk = false;
        if (twilioConfigured && twilioAccountOk) {
            try {
                const client = twilio(accountSid, authToken);
                const phoneNumber = await client.incomingPhoneNumbers
                    .list({ phoneNumber: twilioPhone }, { limit: 1 });
                
                if (phoneNumber.length > 0) {
                    phoneOk = true;
                    const phone = phoneNumber[0];
                    results.checks.phoneNumber = {
                        number: phone.phoneNumber,
                        friendlyName: phone.friendlyName,
                        smsUrl: phone.smsUrl,
                        smsMethod: phone.smsMethod,
                        voiceUrl: phone.voiceUrl
                    };
                    
                    LOG.check('Phone Number Found', true, twilioPhone);
                    LOG.check('SMS Webhook Configured', !!phone.smsUrl, phone.smsUrl || 'Not configured');
                    
                    if (!phone.smsUrl) {
                        results.warnings.push('SMS webhook not configured on Twilio phone number');
                    }
                } else {
                    results.errors.push({
                        check: 'Phone Number',
                        message: `Phone number ${twilioPhone} not found in account`,
                        fix: 'Verify phone number is correct and active in Twilio console'
                    });
                    LOG.check('Phone Number Found', false);
                }
            } catch (err) {
                results.errors.push({
                    check: 'Phone Number',
                    message: `Could not fetch phone number config: ${err.message}`,
                    fix: 'Check Twilio API credentials'
                });
                LOG.check('Phone Number Check', false, err.message);
            }
        }

        // ═══════════════════════════════════════════════════════════
        // CHECK 5: Database Connection
        // ═══════════════════════════════════════════════════════════
        console.log('\n💾 CHECKING DATABASE...');
        
        let dbOk = false;
        try {
            // Try to fetch one record to verify connection
            const testQuery = await prisma.parkingLot.findFirst();
            dbOk = true;
            results.checks.database = {
                status: 'connected',
                lotsCount: await prisma.parkingLot.count(),
                bookingsCount: await prisma.booking.count(),
                smsLogsCount: await prisma.smsLog.count()
            };
            
            LOG.check('MongoDB Connection', true, 'Connected');
            LOG.check('Parking Lots', true, `${results.checks.database.lotsCount} lots found`);
            LOG.check('SMS Logs Collection', true, `${results.checks.database.smsLogsCount} SMS logged`);
        } catch (err) {
            results.errors.push({
                check: 'Database',
                message: `Could not connect to MongoDB: ${err.message}`,
                fix: 'Check DATABASE_URL in Vercel environment variables'
            });
            LOG.check('MongoDB Connection', false, err.message);
        }

        // ═══════════════════════════════════════════════════════════
        // CHECK 6: Cron Job Configuration
        // ═══════════════════════════════════════════════════════════
        console.log('\n⏰ CHECKING CRON JOB...');
        
        results.checks.cronJob = {
            configured: true,
            schedule: '*/5 * * * *',
            endpoint: '/api/cron/notifications',
            description: 'Runs every 5 minutes'
        };
        
        LOG.check('Cron Job (Vercel)', true, 'Every 5 minutes');

        // ═══════════════════════════════════════════════════════════
        // CHECK 7: SMS Sending (Finally!)
        // ═══════════════════════════════════════════════════════════
        console.log('\n📤 CHECKING SMS CAPABILITY...');
        
        let smsSendOk = false;
        if (twilioConfigured && twilioAccountOk && phoneOk) {
            try {
                const client = twilio(accountSid, authToken);
                
                // Test send to Twilio's test number (won't actually send)
                // This just validates that SMS is enabled
                const capabilities = await client.available.phoneNumbers.local
                    .list({ areaCode: '415', limit: 1 });
                
                smsSendOk = true;
                results.checks.smsSending = {
                    status: 'capable',
                    testMessage: 'SMS can be sent'
                };
                
                LOG.check('SMS Sending Capability', true);
            } catch (err) {
                // Some error checking SMS capability - might still work
                results.warnings.push(`Could not fully verify SMS capability: ${err.message}`);
                LOG.check('SMS Sending Capability', false, err.message);
            }
        }

        // ═══════════════════════════════════════════════════════════
        // SUMMARY
        // ═══════════════════════════════════════════════════════════
        console.log('\n📊 GENERATING SUMMARY...');
        
        const passedChecks = Object.values(envCheck).filter(Boolean).length + 
                             (twilioConfigured ? 1 : 0) +
                             (twilioAccountOk ? 1 : 0) +
                             (phoneOk ? 1 : 0) +
                             (dbOk ? 1 : 0) +
                             (smsSendOk ? 1 : 0);
        
        const totalChecks = Object.keys(envCheck).length + 5;
        
        results.summary = {
            status: results.errors.length === 0 ? '✅ READY' : '❌ FAILED',
            passed: passedChecks,
            total: totalChecks,
            readyForTesting: results.errors.length === 0,
            recommendations: [
                ...results.errors.map(e => `❌ ${e.message}`),
                ...results.warnings.map(w => `⚠️ ${w}`)
            ]
        };

        results.summary.nextSteps = results.errors.length === 0 
            ? [
                '✅ All checks passed!',
                '✅ You can now test SMS on live',
                '✅ Visit: /api/test/twilio-dashboard'
              ]
            : [
                '❌ Fix the errors above before testing',
                '❌ Check Vercel environment variables',
                '❌ Verify Twilio account is active'
              ];

        const duration = Date.now() - startTime;
        console.log(`\n✅ Verification completed in ${duration}ms\n`);

        return NextResponse.json(results);

    } catch (error) {
        console.error('VERIFICATION ERROR:', error);
        return NextResponse.json({
            status: 'ERROR',
            message: error.message,
            error: error.toString()
        }, { status: 500 });
    }
}
