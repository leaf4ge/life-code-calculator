import React from 'react';
import numberMeanings from '../data/number_meanings.json';

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

const AnalysisDisplay = ({ data }) => {
    if (!data || !data.values) return null;
    const { values } = data;

    return (
        <div className="analysis-container glass-card animate-fade-in" style={{ animationDelay: '1.4s' }}>
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
    );
};

export default AnalysisDisplay;
