/**
 * ✈️ PRE-FLIGHT CHECKLIST FOR TWILIO TESTING
 * 
 * Interactive checklist to verify everything before testing
 * Visit: /api/test/pre-flight
 */

import { NextResponse } from 'next/server';

const HTML_CHECKLIST = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>✈️ Pre-Flight Checklist</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        .header {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .header p {
            color: #666;
            margin-bottom: 15px;
        }
        .status-bar {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        .status-item {
            flex: 1;
            padding: 10px;
            border-radius: 6px;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
        }
        .status-item.pending { background: #fff3cd; color: #856404; }
        .status-item.pass { background: #d4edda; color: #155724; }
        .status-item.fail { background: #f8d7da; color: #721c24; }
        
        .section {
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .check-item {
            display: flex;
            align-items: center;
            padding: 12px;
            margin-bottom: 10px;
            background: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #ddd;
        }
        .check-item.pass {
            background: #d4edda;
            border-left-color: #28a745;
        }
        .check-item.fail {
            background: #f8d7da;
            border-left-color: #dc3545;
        }
        .check-item.warning {
            background: #fff3cd;
            border-left-color: #ffc107;
        }
        .check-icon {
            font-size: 24px;
            margin-right: 12px;
            min-width: 30px;
        }
        .check-text {
            flex: 1;
        }
        .check-label {
            font-weight: bold;
            color: #333;
            margin-bottom: 3px;
        }
        .check-detail {
            font-size: 13px;
            color: #666;
        }
        .btn-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        .btn {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            transition: opacity 0.3s;
            font-size: 14px;
        }
        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
        .btn-primary:hover {
            opacity: 0.9;
        }
        .btn-secondary {
            background: #f0f0f0;
            color: #333;
        }
        .btn-secondary:hover {
            background: #e0e0e0;
        }
        .results {
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin-top: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .results-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .results-content {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            max-height: 300px;
            overflow-y: auto;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            color: white;
            padding: 20px;
            font-size: 14px;
        }
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .next-steps {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 6px;
            padding: 15px;
            margin-top: 15px;
            color: #155724;
        }
        .next-steps strong {
            display: block;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✈️ Pre-Flight Checklist</h1>
            <p>Verify Twilio is properly configured before testing on live</p>
            <div class="status-bar">
                <div class="status-item pending">📋 Environment</div>
                <div class="status-item pending">🔌 Twilio</div>
                <div class="status-item pending">💾 Database</div>
                <div class="status-item pending">✅ Ready?</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">🚀 Before You Start</div>
            <div class="check-item">
                <div class="check-icon">📋</div>
                <div class="check-text">
                    <div class="check-label">Step 1: Deploy Code</div>
                    <div class="check-detail">Push your code to Vercel (git push)</div>
                </div>
            </div>
            <div class="check-item">
                <div class="check-icon">⚙️</div>
                <div class="check-text">
                    <div class="check-label">Step 2: Environment Variables</div>
                    <div class="check-detail">Verify Vercel has: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER</div>
                </div>
            </div>
            <div class="check-item">
                <div class="check-icon">✅</div>
                <div class="check-text">
                    <div class="check-label">Step 3: Run Verification</div>
                    <div class="check-detail">Click "Verify Setup" below to check everything</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">🔍 System Verification</div>
            <div id="verificationResults"></div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="runVerification()">
                    🔍 Run Verification
                </button>
                <button class="btn btn-secondary" onclick="location.reload()">
                    🔄 Refresh
                </button>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📋 Checklist</div>
            <div id="checklist"></div>
            <div class="btn-group" style="margin-top: 20px;">
                <button class="btn btn-primary" onclick="proceedToTesting()" id="proceedBtn" disabled>
                    ✅ Proceed to Testing
                </button>
                <button class="btn btn-secondary" onclick="viewDashboard()">
                    🎛️ View Dashboard
                </button>
            </div>
        </div>

        <div class="footer">
            <p>✈️ Pre-Flight Checklist v1.0</p>
        </div>
    </div>

    <script>
        let verificationData = null;

        async function runVerification() {
            const resultsDiv = document.getElementById('verificationResults');
            resultsDiv.innerHTML = '<div style="text-align: center; padding: 20px;"><div class="spinner"></div> Running verification...</div>';

            try {
                const response = await fetch('/api/test/twilio-verify');
                verificationData = await response.json();
                
                displayResults();
                updateChecklist();

            } catch (error) {
                resultsDiv.innerHTML = '<div style="color: red; padding: 20px;">❌ Error running verification: ' + error.message + '</div>';
            }
        }

        function displayResults() {
            const resultsDiv = document.getElementById('verificationResults');
            const summary = verificationData.summary;
            
            let status = '✅ READY FOR TESTING';
            let statusColor = '#28a745';
            
            if (!summary.readyForTesting) {
                status = '❌ SETUP INCOMPLETE';
                statusColor = '#dc3545';
            } else if (summary.recommendations.length > 0) {
                status = '⚠️ READY WITH WARNINGS';
                statusColor = '#ffc107';
            }

            let html = \`
                <div style="background: \${statusColor}20; border: 2px solid \${statusColor}; border-radius: 6px; padding: 20px; margin-bottom: 15px;">
                    <div style="font-size: 24px; font-weight: bold; color: \${statusColor}; margin-bottom: 10px;">\${status}</div>
                    <div style="color: #333; font-size: 16px;">
                        Checks Passed: \${summary.passed}/\${summary.total}
                    </div>
                </div>
            \`;

            if (summary.recommendations.length > 0) {
                html += '<div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px; margin-bottom: 15px;">';
                html += '<strong>Issues Found:</strong><ul style="margin-top: 10px; margin-left: 20px;">';
                summary.recommendations.forEach(rec => {
                    html += '<li style="margin-bottom: 5px;">' + rec + '</li>';
                });
                html += '</ul></div>';
            }

            if (summary.nextSteps && summary.nextSteps.length > 0) {
                html += '<div class="next-steps"><strong>Next Steps:</strong>';
                summary.nextSteps.forEach(step => {
                    html += '<div>• ' + step + '</div>';
                });
                html += '</div>';
            }

            resultsDiv.innerHTML = html;
        }

        function updateChecklist() {
            const checklistDiv = document.getElementById('checklist');
            const checks = verificationData.checks;
            const errors = verificationData.errors;
            
            let html = '';

            // Environment Variables
            html += createCheckItem(
                'Environment Variables',
                checks.environment?.TWILIO_ACCOUNT_SID && checks.environment?.TWILIO_AUTH_TOKEN,
                'Twilio credentials configured',
                checks.environment?.TWILIO_ACCOUNT_SID ? '✅' : '❌'
            );

            // Twilio Client
            html += createCheckItem(
                'Twilio Client',
                checks.twilioClient,
                'Client initialized successfully',
                checks.twilioClient ? '✅' : '❌'
            );

            // Twilio Account
            html += createCheckItem(
                'Twilio Account',
                checks.twilioAccount?.status === 'active',
                'Account is active and accessible',
                checks.twilioAccount?.status || '❌'
            );

            // Phone Number
            html += createCheckItem(
                'Phone Number',
                !!checks.phoneNumber?.number,
                'Phone number configured: ' + (checks.phoneNumber?.number || 'Not found'),
                checks.phoneNumber?.number ? '✅' : '❌'
            );

            // Database
            html += createCheckItem(
                'Database',
                checks.database?.status === 'connected',
                'MongoDB connected, ' + (checks.database?.smsLogsCount || 0) + ' SMS logs',
                checks.database?.status === 'connected' ? '✅' : '❌'
            );

            // Cron Job
            html += createCheckItem(
                'Cron Job',
                checks.cronJob?.configured,
                'Reminder check every 5 minutes',
                '✅'
            );

            checklistDiv.innerHTML = html;

            // Enable/disable proceed button
            const ready = verificationData.summary.readyForTesting;
            document.getElementById('proceedBtn').disabled = !ready;
            if (ready) {
                document.getElementById('proceedBtn').style.opacity = '1';
                document.getElementById('proceedBtn').style.cursor = 'pointer';
            }
        }

        function createCheckItem(title, passed, detail, icon) {
            const className = passed ? 'pass' : 'fail';
            const emoji = passed ? '✅' : '❌';
            
            return \`
                <div class="check-item \${className}">
                    <div class="check-icon">\${emoji}</div>
                    <div class="check-text">
                        <div class="check-label">\${title}</div>
                        <div class="check-detail">\${detail}</div>
                    </div>
                </div>
            \`;
        }

        function proceedToTesting() {
            if (verificationData.summary.readyForTesting) {
                window.location.href = '/api/test/twilio-dashboard';
            }
        }

        function viewDashboard() {
            window.location.href = '/api/test/twilio-dashboard';
        }

        // Auto-run verification on load
        window.addEventListener('load', runVerification);
    </script>
</body>
</html>
`;

export async function GET(req) {
    return new Response(HTML_CHECKLIST, {
        headers: { 'Content-Type': 'text/html' }
    });
}
