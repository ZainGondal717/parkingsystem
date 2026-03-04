/**
 * 🎛️ LIVE TWILIO TEST DASHBOARD
 * Visual interface for testing Twilio on production
 */

import { NextResponse } from 'next/server';

const HTML_DASHBOARD = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎛️ Twilio Test Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        .header {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .header h1 {
            font-size: 32px;
            color: #333;
            margin-bottom: 10px;
        }
        .header p {
            color: #666;
            font-size: 16px;
        }
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .status-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .status-label {
            font-size: 12px;
            color: #999;
            text-transform: uppercase;
        }
        .status-value {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-top: 5px;
        }
        .tests-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .test-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .test-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        .test-icon {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .test-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }
        .test-desc {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        .test-input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .test-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            transition: opacity 0.3s;
        }
        .test-btn:hover {
            opacity: 0.9;
        }
        .test-btn:active {
            transform: scale(0.98);
        }
        .info-section {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin-bottom: 30px;
        }
        .info-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        .info-content {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            color: #333;
            overflow-x: auto;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            color: white;
            padding: 20px;
            font-size: 14px;
        }
        .alert {
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 15px;
            font-size: 14px;
        }
        .alert-success {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        .alert-error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        @media (max-width: 768px) {
            .tests-grid {
                grid-template-columns: 1fr;
            }
            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🧪 TWILIO SMS TEST DASHBOARD</h1>
            <p>Test SMS functionality in real-time on production</p>
            <div class="status-grid">
                <div class="status-card">
                    <div class="status-label">Environment</div>
                    <div class="status-value">🌍 Production</div>
                </div>
                <div class="status-card">
                    <div class="status-label">Status</div>
                    <div class="status-value" id="status">⏳ Loading...</div>
                </div>
                <div class="status-card">
                    <div class="status-label">Phone</div>
                    <div class="status-value">+18449332847</div>
                </div>
            </div>
        </div>

        <!-- Alert Box -->
        <div id="alertBox"></div>

        <!-- Test Cards -->
        <div class="tests-grid">
            <!-- Status Check -->
            <div class="test-card">
                <div class="test-icon">✅</div>
                <div class="test-title">Check Status</div>
                <div class="test-desc">Verify Twilio is configured and ready</div>
                <button class="test-btn" onclick="runTest('status')">Check Status</button>
            </div>

            <!-- Zone Code SMS -->
            <div class="test-card">
                <div class="test-icon">📍</div>
                <div class="test-title">Zone Code SMS</div>
                <div class="test-desc">Send zone code booking link SMS</div>
                <input type="text" class="test-input" id="phone-zone" placeholder="+12125551234" value="+14155552671">
                <button class="test-btn" onclick="runTest('send-zone')">Send Zone SMS</button>
            </div>

            <!-- Booking Confirmation -->
            <div class="test-card">
                <div class="test-icon">🎫</div>
                <div class="test-title">Booking Confirmation</div>
                <div class="test-desc">Send booking confirmation SMS</div>
                <input type="text" class="test-input" id="phone-booking" placeholder="+12125551234" value="+14155552671">
                <button class="test-btn" onclick="runTest('send-booking')">Send Booking SMS</button>
            </div>

            <!-- Extension SMS -->
            <div class="test-card">
                <div class="test-icon">⏱️</div>
                <div class="test-title">Extension SMS</div>
                <div class="test-desc">Send booking extension confirmation</div>
                <input type="text" class="test-input" id="phone-extension" placeholder="+12125551234" value="+14155552671">
                <button class="test-btn" onclick="runTest('send-extension')">Send Extension SMS</button>
            </div>

            <!-- Reminder SMS -->
            <div class="test-card">
                <div class="test-icon">⏰</div>
                <div class="test-title">10-Min Reminder</div>
                <div class="test-desc">Send time reminder SMS</div>
                <input type="text" class="test-input" id="phone-reminder" placeholder="+12125551234" value="+14155552671">
                <button class="test-btn" onclick="runTest('send-reminder')">Send Reminder SMS</button>
            </div>

            <!-- View Logs -->
            <div class="test-card">
                <div class="test-icon">📊</div>
                <div class="test-title">View SMS Logs</div>
                <div class="test-desc">See recent SMS messages</div>
                <input type="number" class="test-input" id="log-limit" placeholder="20" value="20" min="5" max="100">
                <button class="test-btn" onclick="runTest('logs')">View Logs</button>
            </div>
        </div>

        <!-- Instructions -->
        <div class="info-section">
            <div class="info-title">📋 Instructions</div>
            <div class="info-content">
1. Replace +14155552671 with your actual phone number<br>
2. Click any test button above<br>
3. Check your phone for SMS (appears in 1-3 seconds)<br>
4. Check Vercel logs: Vercel Dashboard → Functions → /api/test/twilio-admin<br>
5. View all SMS logs in database with "View SMS Logs"<br>
<br>
📱 Format: +[Country Code][Number] (e.g., +12125551234 for USA)
            </div>
        </div>

        <!-- Response -->
        <div id="responseBox"></div>

        <!-- Footer -->
        <div class="footer">
            <p>🧪 Twilio SMS Test Dashboard v1.0 | All tests log to database</p>
        </div>
    </div>

    <script>
        // Check initial status
        checkStatus();

        function showAlert(message, type = 'success') {
            const alertBox = document.getElementById('alertBox');
            alertBox.innerHTML = \`<div class="alert alert-\${type}">\${message}</div>\`;
            setTimeout(() => { alertBox.innerHTML = ''; }, 5000);
        }

        function checkStatus() {
            fetch('?action=status')
                .then(r => r.json())
                .then(data => {
                    const statusEl = document.getElementById('status');
                    if (data.configured) {
                        statusEl.innerHTML = '🟢 Ready';
                        statusEl.style.color = '#28a745';
                    } else {
                        statusEl.innerHTML = '🔴 Not Configured';
                        statusEl.style.color = '#dc3545';
                    }
                });
        }

        function runTest(action) {
            let phone = '+14155552671';
            
            if (action === 'send-zone') {
                phone = document.getElementById('phone-zone').value || '+14155552671';
            } else if (action === 'send-booking') {
                phone = document.getElementById('phone-booking').value || '+14155552671';
            } else if (action === 'send-extension') {
                phone = document.getElementById('phone-extension').value || '+14155552671';
            } else if (action === 'send-reminder') {
                phone = document.getElementById('phone-reminder').value || '+14155552671';
            }

            let url = \`?action=\${action}\`;
            if (phone && (action.includes('send') || action === 'logs')) {
                if (action === 'logs') {
                    const limit = document.getElementById('log-limit').value || 20;
                    url = \`?action=logs&limit=\${limit}\`;
                } else {
                    url += \`&phone=\${encodeURIComponent(phone)}\`;
                }
            }

            document.getElementById('responseBox').innerHTML = '<p style="text-align:center; color: white;">⏳ Running test...</p>';

            fetch(url)
                .then(r => r.json())
                .then(data => {
                    let html = '<div class="info-section"><div class="info-title">📤 Response</div><div class="info-content">' + 
                              JSON.stringify(data, null, 2) + '</div></div>';
                    document.getElementById('responseBox').innerHTML = html;
                    
                    if (data.status === 'SUCCESS' || data.status === 'OK') {
                        showAlert('✅ ' + (data.message || 'Test completed successfully!'), 'success');
                    } else if (data.status === 'FAILED') {
                        showAlert('❌ ' + (data.error || 'Test failed'), 'error');
                    }
                })
                .catch(err => {
                    document.getElementById('responseBox').innerHTML = '';
                    showAlert('❌ Error: ' + err.message, 'error');
                });
        }
    </script>
</body>
</html>
`;

export async function GET(req) {
    return new Response(HTML_DASHBOARD, {
        headers: { 'Content-Type': 'text/html' }
    });
}
