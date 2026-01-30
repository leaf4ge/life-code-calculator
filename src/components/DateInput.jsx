import React from 'react';

const DateInput = ({ onDateChange }) => {
    const handleChange = (e) => {
        const dateVal = e.target.value; // YYYY-MM-DD
        if (dateVal) {
            const [y, m, d] = dateVal.split('-');
            onDateChange(d, m, y);
        } else {
            onDateChange('', '', '');
        }
    };

    return (
        <div className="glass-card animate-fade-in">
            <div className="input-group">
                <label style={{ fontSize: '1.2rem', marginRight: '1rem', color: 'var(--accent-gold)' }}>
                    請選擇出生日期
                </label>
                <input
                    type="date"
                    onChange={handleChange}
                    className="date-picker-custom"
                    style={{ width: 'auto' }}
                />
            </div>
        </div>
    );
};

export default DateInput;
