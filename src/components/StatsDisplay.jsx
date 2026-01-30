import React from 'react';

// Color Mapping
const ELEMENT_CONFIG = {
    metal: { name: '金', color: '#ffd700' },
    water: { name: '水', color: '#60a5fa' },
    fire: { name: '火', color: '#f87171' },
    wood: { name: '木', color: '#4ade80' },
    earth: { name: '土', color: '#a78bfa' }
};

// Generating Cycle
const CYCLE = ['metal', 'water', 'wood', 'fire', 'earth'];

// Labels correspond to the sorted cycle positions (Self -> Output -> etc.)
const CYCLE_LABELS = [
    '自身',           // 1. Self
    '子女/財富',    // 2. Output
    '事業/伴侶',    // 3. Wealth/Partner (Rough mapping for user request)
    '官鬼/疾病',    // 4. Officer/Ghost
    '父母貴人'      // 5. Resource/Parent
];

// Fixed Numbers Pattern requested by user (4, 3, 3, 3, 3)
const FIXED_NUMBERS = [4, 3, 3, 3, 3];

const getElementKey = (num) => {
    if (num === 1 || num === 6) return 'metal';
    if (num === 2 || num === 7) return 'water';
    if (num === 3 || num === 8) return 'fire';
    if (num === 4 || num === 9) return 'wood';
    if (num === 5) return 'earth';
    return 'water';
};

const ElementColumn = ({ type, count, label, fixedNum, onHover }) => {
    const config = ELEMENT_CONFIG[type];
    return (
        <div
            className="element-column"
            onMouseEnter={() => onHover(type)}
            onMouseLeave={() => onHover(null)}
            style={{ borderColor: config.color }}
        >
            {/* 1. Element & Count */}
            <div className="element-header">
                <span style={{ color: config.color, fontWeight: 'bold' }}>{config.name}</span>
                <span className="element-count-val">{count}</span>
            </div>

            {/* 2. User Label */}
            <div className="element-label">{label}</div>

            {/* 3. Fixed Number */}
            <div className="element-fixed-num">{fixedNum}</div>
        </div>
    );
};

const StatsDisplay = ({ data, onElementHover }) => {
    if (!data) return null;
    const { fiveElements, missingNumbers, values } = data;
    const O = values.O;

    // 1. Determine Element of O
    const startElement = getElementKey(O);

    // 2. Reorder CYCLE starting from startElement
    const startIndex = CYCLE.indexOf(startElement);
    const sortedCycle = [
        ...CYCLE.slice(startIndex),
        ...CYCLE.slice(0, startIndex)
    ];

    return (
        <div className="stats-container animate-fade-in" style={{ animationDelay: '1.2s' }}>

            {/* Five Elements Section */}
            <div className="stats-section glass-card">
                <h3>五行屬性</h3>
                <div className="elements-grid no-wrap">
                    {sortedCycle.map((key, idx) => (
                        <ElementColumn
                            key={key}
                            type={key}
                            count={fiveElements[key]}
                            label={CYCLE_LABELS[idx]}
                            fixedNum={FIXED_NUMBERS[idx]}
                            onHover={onElementHover}
                        />
                    ))}
                </div>
            </div>

            {/* Missing Numbers Section */}
            <div className="stats-section glass-card">
                <h3>缺失數字 (倒三角 I-O)</h3>
                <div className="missing-numbers">
                    {missingNumbers.length > 0 ? (
                        missingNumbers.map(num => (
                            <span key={num} className="missing-num">{num}</span>
                        ))
                    ) : (
                        <span className="no-missing">無缺失數字 (圓滿)</span>
                    )}
                </div>
            </div>

        </div>
    );
};

export default StatsDisplay;
