import React from 'react';
import numberMeanings from '../data/number_meanings.json';
import missingMeanings from '../data/missing_numbers.json';
import lifePathMeanings from '../data/life_path.json';
import fiveElementMeanings from '../data/five_elements.json';

// Configuration of the 13 Combinations
const ANALYSIS_CONFIG = [
    { id: 1, label: '父基因', keys: ['I', 'J', 'M'] },
    { id: 2, label: '母基因', keys: ['K', 'L', 'N'] },
    { id: 3, label: '主性格', keys: ['M', 'N', 'O'] },
    { id: 4, label: '過程', keys: ['M', 'O', 'Q'] }, // Note: User order MOQ
    { id: 5, label: '過程', keys: ['N', 'O', 'P'] }, // Note: User order NOP
    { id: 6, label: '子女下屬', keys: ['P', 'Q', 'Y'] },
    { id: 7, label: '事業過程', keys: ['I', 'M', 'T'] },
    { id: 8, label: '事業過程', keys: ['J', 'M', 'S'] },
    // Note: For item 9, usually Left Box is R-S-T. User wrote TSR. 
    // Code values: T is Right-most of left box, S is Mid, R is Left-most.
    // Visual Left-to-Right in box is R-S-T. 
    // User Prompt sequence "TSR". I will follow specific variable order requested.
    { id: 9, label: '當下朋友', keys: ['T', 'S', 'R'] },
    { id: 10, label: '婚姻過程', keys: ['K', 'N', 'U'] },
    { id: 11, label: '婚姻過程', keys: ['L', 'N', 'V'] },
    { id: 12, label: '未來財富/健康/子媳', keys: ['U', 'V', 'W'] },
    { id: 13, label: '隱藏號', keys: ['H1', 'H2', 'H3'] },
];

const getMeaning = (numStr) => {
    // Database keys are like "112" or "123_213"
    // We need to find the key that contains our numStr
    // 1. Direct match
    if (numberMeanings[numStr]) return numberMeanings[numStr];

    // 2. Split match (e.g. key "123_213" should match "213")
    const foundKey = Object.keys(numberMeanings).find(k => {
        const parts = k.split('_');
        return parts.includes(numStr);
    });

    if (foundKey) return numberMeanings[foundKey];

    return null;
};

const AnalysisRow = ({ config, values }) => {
    // Construct the 3-digit number from values
    const numStr = config.keys.map(k => values[k]).join('');
    const meaning = getMeaning(numStr);

    return (
        <div className="analysis-row">
            {/* Index */}
            <div className="analysis-cell index">{config.id}</div>

            {/* Label and Title (from DB if available) */}
            <div className="analysis-cell label-col">
                <div className="main-label">{config.label}</div>
                {meaning && <div className="sub-label">{meaning.title}</div>}
            </div>

            {/* Number */}
            <div className="analysis-cell number-col">
                {numStr}
            </div>

            {/* Description */}
            <div className="analysis-cell desc-col">
                {meaning ? (
                    <ul>
                        {meaning.content.map((line, idx) => (
                            <li key={idx}>{line}</li>
                        ))}
                    </ul>
                ) : (
                    <span className="no-data">--</span>
                )}
            </div>
        </div>
    );
};

const LifePathSection = ({ lifePathNumber }) => {
    const data = lifePathMeanings[lifePathNumber];
    if (!data) return null;

    return (
        <div className="analysis-container glass-card animate-fade-in" style={{ animationDelay: '1.6s', marginTop: '2rem' }}>
            <h3 style={{ textAlign: 'center', color: 'var(--accent-gold)', marginBottom: '1rem' }}>
                {data.title}
            </h3>
            <div className="life-path-content" style={{ padding: '0 1rem' }}>
                <p style={{ marginBottom: '1rem' }}><strong>關鍵詞：</strong>{data.keywords}</p>
                <div className="description-block" style={{ marginBottom: '1rem' }}>
                    {data.description.map((desc, idx) => (
                        <p key={idx} style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}>{desc}</p>
                    ))}
                </div>
                <div className="energy-block" style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#4ade80' }}>正面與天賦：</strong>{data.positive}</p>
                    <p><strong style={{ color: '#f87171' }}>負面：</strong>{data.negative}</p>
                </div>
            </div>
        </div>
    );
};

const MissingNumbersSection = ({ missingNumbers }) => {
    if (!missingNumbers || missingNumbers.length === 0) return null;

    return (
        <div className="analysis-container glass-card animate-fade-in" style={{ animationDelay: '1.8s', marginTop: '2rem' }}>
            <h3 style={{ textAlign: 'center', color: 'var(--accent-gold)', marginBottom: '1rem' }}>
                數字缺失能量
            </h3>
            <div className="missing-numbers-list" style={{ padding: '0 1rem' }}>
                {missingNumbers.map(num => {
                    const data = missingMeanings[num];
                    return (
                        <div key={num} className="missing-item" style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                                {data ? data.title : `缺 ${num}`}
                            </h4>
                            {data && data.content.map((line, idx) => (
                                <p key={idx} style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: '1.6' }}>{line}</p>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const elementMap = {
    1: 'metal', 6: 'metal',
    2: 'water', 7: 'water',
    3: 'fire', 8: 'fire',
    4: 'wood', 9: 'wood',
    5: 'earth'
};

const FiveElementsSection = ({ fiveElements, lifePathNumber }) => {
    if (!fiveElements || !lifePathNumber) return null;

    const lifePathElement = elementMap[lifePathNumber];
    if (!lifePathElement) return null; // Should not happen for valid 1-9

    // Generating Cycle: Metal -> Water -> Wood -> Fire -> Earth -> Metal
    const generatingOrder = ['metal', 'water', 'wood', 'fire', 'earth'];

    // Find start index based on Life Path Element
    const startIndex = generatingOrder.indexOf(lifePathElement);

    // Create the ordered list of 5 elements starting from Life Path Element
    const orderedElements = [
        ...generatingOrder.slice(startIndex),
        ...generatingOrder.slice(0, startIndex)
    ];

    const elementLabels = [
        '自身',           // Self
        '子女/財富',      // Output (Generates)
        '事業/伴侶',      // Wealth (Controlled by Output?) - Following user sequence: Wood->Fire->Earth (Earth is wealth of Wood)
        '官鬼/疾病',      // Officer (Controls Self?) - Wood->Fire->Earth->Metal (Metal controls Wood)
        '父母貴人'        // Resource (Generates Self) - Wood...->Water (Water generates Wood)
    ];

    return (
        <div className="analysis-container glass-card animate-fade-in" style={{ animationDelay: '2.0s', marginTop: '2rem' }}>
            <h3 style={{ textAlign: 'center', color: 'var(--accent-gold)', marginBottom: '1rem' }}>
                五行能量分析 (相生順序)
            </h3>

            <div className="five-elements-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
            }}>
                {orderedElements.map((key, index) => {
                    const count = fiveElements[key];
                    const data = fiveElementMeanings[key];
                    const label = elementLabels[index];

                    // Distinct logic for Self (Index 0) vs Others
                    const isSelf = index === 0;
                    const standard = isSelf ? 4 : 3;

                    // Color coding based on count vs standard
                    let borderColor = 'rgba(255,255,255,0.2)';
                    if (count === 0) borderColor = '#f87171'; // Red (Missing)
                    else if (count < standard) borderColor = '#60a5fa'; // Blue (Weak)
                    else if (count > standard) borderColor = '#fbbf24'; // Yellow (High)
                    else borderColor = '#4ade80'; // Green (Balanced)

                    return (
                        <div key={key} className="element-card" style={{
                            border: `1px solid ${borderColor}`,
                            borderRadius: '8px',
                            padding: '0.5rem',
                            background: 'rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                                {data.title.split(' ')[0]} {/* e.g., 金 */}
                            </div>
                            <div style={{ fontSize: '1.5rem', margin: '0.2rem 0' }}>
                                {count}
                            </div>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.3rem 0' }}></div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.2rem' }}>
                                {label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                                平衡: {standard}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="five-elements-details" style={{ padding: '0 1rem' }}>
                {orderedElements.map((key, index) => {
                    const count = fiveElements[key];
                    const data = fiveElementMeanings[key];
                    if (!data) return null;

                    const isSelf = index === 0;
                    const standard = isSelf ? 4 : 3;

                    // Determining status based on count and standard
                    let status = null;
                    let content = [];
                    let statusColor = 'inherit';
                    let statusBg = 'rgba(255,255,255,0.1)';

                    if (count === 0) {
                        status = '缺失 (0)';
                        content = data.zero || [];
                        statusColor = '#f87171';
                        statusBg = 'rgba(239, 68, 68, 0.2)';
                    } else if (count > standard) {
                        status = `過旺 (>${standard})`;
                        content = data.high || [];
                        statusColor = '#fbbf24';
                        statusBg = 'rgba(234, 179, 8, 0.2)';
                    } else if (count < standard) {
                        status = `偏弱 (<${standard})`;
                        content = data.low || [];
                        statusColor = '#60a5fa'; // Light Blue
                        statusBg = 'rgba(96, 165, 250, 0.2)';
                    } else {
                        // Exact match to standard
                        status = `平衡 (${standard})`;
                        content = data.balanced || [];
                        statusColor = '#4ade80';
                        statusBg = 'rgba(74, 222, 128, 0.2)';
                    }

                    // Only show detailed list if not balanced, or show balanced msg if balanced
                    // User wants to see valid info. 

                    return (
                        <div key={key} className="element-item" style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: 0 }}>
                                    {data.title.split(' ')[0]} <span style={{ fontSize: '0.9em', opacity: 0.8 }}>({count})</span>
                                </h4>
                                <span style={{
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    background: statusBg,
                                    color: statusColor
                                }}>{status}</span>
                            </div>

                            <p style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', marginBottom: '0.5rem', opacity: 0.9 }}>
                                {data.title.substring(data.title.indexOf('-') + 1).trim()}
                            </p>

                            {content.length > 0 ? (
                                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                    {content.map((line, idx) => (
                                        <li key={idx} style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '0.3rem' }}>{line}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ fontSize: '0.9rem', opacity: 0.6, fontStyle: 'italic' }}>
                                    {count === standard ? '能量平衡，運勢穩定' : '無特殊過旺或過弱現象'}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const AnalysisDisplay = ({ data }) => {
    if (!data || !data.values) return null;
    const { values, missingNumbers, fiveElements } = data;
    const lifePathNumber = values.O;

    return (
        <div className="analysis-wrapper" style={{
            width: '100%',
            maxWidth: '1600px', // Increased from 1200px to allow more breathing room
            margin: '2rem auto',
            padding: '0 2rem'   // Increased side padding
        }}>

            <div className="analysis-grid" style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '4rem',       // Increased gap from 2rem to 4rem for separation
                alignItems: 'flex-start'
            }}>
                {/* Left Column: Personal Analysis */}
                <div className="left-column" style={{ flex: '1 1 500px', minWidth: '350px' }}>
                    <LifePathSection lifePathNumber={lifePathNumber} />
                    <MissingNumbersSection missingNumbers={missingNumbers} />
                    <FiveElementsSection fiveElements={fiveElements} lifePathNumber={lifePathNumber} />
                </div>

                {/* Right Column: 81 Combinations */}
                <div className="right-column" style={{ flex: '1 1 500px', minWidth: '350px' }}>
                    <div className="analysis-container glass-card animate-fade-in" style={{ animationDelay: '1.4s', height: '100%' }}>
                        <h3 style={{ textAlign: 'center', color: 'var(--accent-gold)', marginBottom: '1rem' }}>
                            聯合數字解析 (81組)
                        </h3>

                        <div className="analysis-table">
                            {/* Header (Optional, style like image usually has no header or simple one) */}
                            {ANALYSIS_CONFIG.map(config => (
                                <AnalysisRow key={config.id} config={config} values={values} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisDisplay;
