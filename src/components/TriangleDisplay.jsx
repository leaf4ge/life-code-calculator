import React, { useState } from 'react';

// Configuration for node positions
const COORDS = {
    // --- Input Row (Y=140) ---
    A: { x: 180, y: 140 }, B: { x: 240, y: 140 },
    C: { x: 320, y: 140 }, D: { x: 380, y: 140 },
    E: { x: 480, y: 140 }, F: { x: 540, y: 140 },
    G: { x: 620, y: 140 }, H: { x: 680, y: 140 },

    // --- Row 1 (Y=240) ---
    I: { x: 210, y: 240 },
    J: { x: 350, y: 240 },
    K: { x: 510, y: 240 },
    L: { x: 650, y: 240 },

    // --- Row 2 (Y=340) ---
    M: { x: 280, y: 340 },
    N: { x: 580, y: 340 },

    // --- Center O (Y=440) ---
    O: { x: 430, y: 440 },

    // --- Inner Triangle Base (P, Q) (Y=540) ---
    P: { x: 330, y: 540 },
    Q: { x: 530, y: 540 },

    // --- Bottom Boxes ---
    R: { x: 150, y: 620 },
    S: { x: 210, y: 620 },
    T: { x: 270, y: 620 },

    U: { x: 590, y: 620 },
    V: { x: 650, y: 620 },
    W: { x: 710, y: 620 },

    // --- Circles ---
    Z: { x: 430, y: 60 }, // Root
    Y: { x: 430, y: 720 }, // Base

    // --- Hidden Numbers (Bottom Row) ---
    H1: { x: 310, y: 840 },
    H2: { x: 430, y: 840 },
    H3: { x: 550, y: 840 },
};

const ELEMENT_NUMBERS = {
    metal: [1, 6],
    water: [2, 7],
    fire: [3, 8],
    wood: [4, 9],
    earth: [5]
};

// Scope for Element Highlighting (I..Y only)
const ELEMENT_HIGHLIGHT_SCOPE = [
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
    'R', 'S', 'T', 'U', 'V', 'W', 'Y'
];

// Dependency Graph for Highlighting
const DEPENDENCIES = {
    I: ['A', 'B'], J: ['C', 'D'], K: ['E', 'F'], L: ['G', 'H'],
    M: ['I', 'J'], N: ['K', 'L'],
    O: ['M', 'N'],
    P: ['N', 'O'], Q: ['M', 'O'],
    T: ['I', 'M'], S: ['J', 'M'], R: ['S', 'T'],
    U: ['K', 'N'], V: ['L', 'N'], W: ['U', 'V'],
    Z: ['I', 'L', 'O'],
    Y: ['P', 'Q'], // Logic corrected physically here too
    H1: ['M'], H2: ['N'], H3: ['O']
};

const Node = ({ id, value, x, y, delay, type = 'circle', label, showStar, onMouseEnter, onMouseLeave, isHighlighted }) => {
    const isSquare = type === 'square';
    const style = {
        left: x,
        top: y,
        animationDelay: `${delay}s`,
        borderRadius: isSquare ? '8px' : '50%',
        width: isSquare ? '50px' : '60px',
        height: isSquare ? '50px' : '60px',
    };

    return (
        <div
            className={`node-absolute ${isSquare ? 'node-square' : ''} ${isHighlighted ? 'highlighted' : ''}`}
            style={style}
            title={label}
            onMouseEnter={() => onMouseEnter(id)}
            onMouseLeave={onMouseLeave}
        >
            {value}
            {showStar && <div className="node-star">★</div>}
        </div>
    );
};

const TriangleDisplay = ({ data, highlightedElement }) => {
    if (!data || !data.values) return null;
    const v = data.values;
    const [hoveredNode, setHoveredNode] = useState(null);

    const handleMouseEnter = (id) => setHoveredNode(id);
    const handleMouseLeave = () => setHoveredNode(null);

    const getHighlightStatus = (nodeId) => {
        // 1. Dependency Highlighting (Hovering Nodes)
        if (hoveredNode) {
            if (hoveredNode === nodeId) return true;
            const deps = DEPENDENCIES[hoveredNode];
            if (deps && deps.includes(nodeId)) return true;
        }

        // 2. Element Highlighting (Hovering Stats)
        if (highlightedElement) {
            // Only highlight if nodeId is in the allowed scope
            if (ELEMENT_HIGHLIGHT_SCOPE.includes(nodeId)) {
                const targetNums = ELEMENT_NUMBERS[highlightedElement];
                const val = v[nodeId];
                if (targetNums.includes(val)) return true;
            }
        }

        return false;
    };

    const renderNode = (key, type = 'circle', delay = 0, label = key, showStar = false) => (
        <Node
            key={key}
            id={key}
            value={v[key]}
            {...COORDS[key]}
            type={type}
            delay={delay}
            label={label}
            showStar={showStar}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            isHighlighted={getHighlightStatus(key)}
        />
    );

    return (
        <div className="triangle-wrapper-absolute" style={{ width: '860px', height: '940px' }}>
            <svg className="triangle-svg" viewBox="0 0 860 940">
                <defs>
                    <linearGradient id="gradLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: 'var(--accent-gold)', stopOpacity: 0.5 }} />
                        <stop offset="100%" style={{ stopColor: 'var(--accent-cyan)', stopOpacity: 0.5 }} />
                    </linearGradient>
                </defs>

                {/* --- Connections --- */}
                <line x1={COORDS.Z.x} y1={COORDS.Z.y + 30} x2={430} y2={140} stroke="var(--accent-gold)" strokeDasharray="4" />

                <path d={`M 150 240 L 710 240 L 430 440 Z`}
                    fill="url(#gradLine)" fillOpacity="0.05" stroke="var(--accent-cyan)" strokeWidth="1" />

                <path d={`M ${COORDS.P.x} ${COORDS.P.y} L ${COORDS.O.x} ${COORDS.O.y} L ${COORDS.Q.x} ${COORDS.Q.y} Z`}
                    fill="none" stroke="var(--accent-gold)" strokeWidth="1" />

                <rect x="280" y="810" width="300" height="90" rx="15" fill="none" stroke="var(--glass-border)" strokeDasharray="4" />
                <text x="430" y="800" textAnchor="middle" fill="var(--text-secondary)" fontSize="14">隱藏號 (主性格)</text>

            </svg>

            {/* --- Nodes --- */}
            {renderNode('Z', 'circle', 0, 'Root (Z)')}

            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((k, i) => renderNode(k, 'square', 0.1))}

            {renderNode('I', 'circle', 0.5, 'I', true)}
            {renderNode('J', 'circle', 0.5, 'J')}
            {renderNode('K', 'circle', 0.6, 'K')}
            {renderNode('L', 'circle', 0.6, 'L', true)}

            {renderNode('M', 'circle', 0.7, 'M')}
            {renderNode('N', 'circle', 0.7, 'N')}

            {renderNode('O', 'circle', 0.8, 'O', true)}

            {renderNode('P', 'circle', 0.9, 'P')}
            {renderNode('Q', 'circle', 0.9, 'Q')}

            {['R', 'S', 'T'].map(k => renderNode(k, 'square', 1.0, k))}
            {['U', 'V', 'W'].map(k => renderNode(k, 'square', 1.1, k))}

            {renderNode('Y', 'circle', 1.2, 'Base (Y)')}

            {['H1', 'H2', 'H3'].map(k => renderNode(k, 'square', 1.3))}

        </div>
    );
};

export default TriangleDisplay;
