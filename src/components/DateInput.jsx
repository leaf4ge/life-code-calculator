import React from 'react';

const DateInput = ({ onDateChange }) => {
    const [year, setYear] = React.useState('');
    const [month, setMonth] = React.useState('');
    const [day, setDay] = React.useState('');

    // Update parent whenever fields change
    React.useEffect(() => {
        onDateChange(day, month, year);
    }, [day, month, year, onDateChange]);

    const handleYearChange = (e) => {
        const val = e.target.value;
        if (val.length <= 4) setYear(val);
    };

    const handleMonthChange = (e) => {
        const val = e.target.value;
        if (val.length <= 2) setMonth(val);
    };

    const handleDayChange = (e) => {
        const val = e.target.value;
        if (val.length <= 2) setDay(val);
    };

    return (
        <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <label style={{
                display: 'block',
                fontSize: '1.1rem',
                marginBottom: '1rem',
                color: 'var(--accent-gold)',
                textAlign: 'center'
            }}>
                請輸入出生日期
            </label>
            <div className="date-inputs" style={{
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <input
                    type="number"
                    inputMode="numeric"
                    placeholder="日 (DD)"
                    value={day}
                    onChange={handleDayChange}
                    className="date-field"
                    style={{ flex: 1, textAlign: 'center', minWidth: '50px' }}
                />
                <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>/</span>
                <input
                    type="number"
                    inputMode="numeric"
                    placeholder="月 (MM)"
                    value={month}
                    onChange={handleMonthChange}
                    className="date-field"
                    style={{ flex: 1, textAlign: 'center', minWidth: '50px' }}
                />
                <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>/</span>
                <input
                    type="number"
                    inputMode="numeric"
                    placeholder="年 (YYYY)"
                    value={year}
                    onChange={handleYearChange}
                    className="date-field"
                    style={{ flex: 1.5, textAlign: 'center', minWidth: '70px' }}
                />
            </div>
        </div>
    );
};

export default DateInput;
