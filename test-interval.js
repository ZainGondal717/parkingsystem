function isActive(booking, now) {
    const start = new Date(booking.createdAt);
    let end = new Date(start);

    const value = booking.durationValue;
    switch (booking.durationMode) {
        case 'half':
            end.setMinutes(start.getMinutes() + 30);
            break;
        case 'hourly':
            end.setMinutes(start.getMinutes() + (value * 60));
            break;
        case 'daily':
            end.setHours(start.getHours() + (value * 24));
            break;
        case 'weekly':
            end.setDate(start.getDate() + (value * 7));
            break;
        case 'monthly':
            end.setMonth(start.getMonth() + value);
            break;
        default:
            return false;
    }
    return now < end;
}

const now = new Date();
const tests = [
    { name: '1 Hour Ago (should be active)', createdAt: new Date(now.getTime() - 15 * 60000).toISOString(), durationMode: 'hourly', durationValue: 1, expected: true },
    { name: '2 Hours Ago (should NOT be active)', createdAt: new Date(now.getTime() - 121 * 60000).toISOString(), durationMode: 'hourly', durationValue: 2, expected: false },
    { name: '30 Mins (Half) - Just booked (should be active)', createdAt: now.toISOString(), durationMode: 'half', durationValue: 1, expected: true },
    { name: '30 Mins (Half) - 31 Mins ago (should NOT be active)', createdAt: new Date(now.getTime() - 31 * 60000).toISOString(), durationMode: 'half', durationValue: 1, expected: false }
];

tests.forEach(test => {
    const result = isActive(test, now);
    console.log(`${test.name}: Result=${result}, Expected=${test.expected} - ${result === test.expected ? 'PASS' : 'FAIL'}`);
});
