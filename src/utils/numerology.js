
/**
 * Reduces a number to a single digit by recursively summing its digits.
 * @param {number} num 
 * @returns {number}
 */
export const sumToSingleDigit = (num) => {
    let n = Math.abs(num);
    if (n === 0) return 0;
    while (n > 9) {
        n = n.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return n;
};

/**
 * Calculates the full Life Code Chart (A-W, Z, Y, Hidden).
 * @param {string} day 
 * @param {string} month 
 * @param {string} year 
 */
export const calculateLifeCode = (day, month, year) => {
    // Pad strings
    const dStr = day.toString().padStart(2, '0');
    const mStr = month.toString().padStart(2, '0');
    const yStr = year.toString().padStart(4, '0');

    // Parse Initial Input (A-H)
    const A = parseInt(dStr[0]);
    const B = parseInt(dStr[1]);
    const C = parseInt(mStr[0]);
    const D = parseInt(mStr[1]);
    const E = parseInt(yStr[0]);
    const F = parseInt(yStr[1]);
    const G = parseInt(yStr[2]);
    const H = parseInt(yStr[3]);

    // --- Main Inverted Triangle (Row 1) ---
    const I = sumToSingleDigit(A + B);
    const J = sumToSingleDigit(C + D);
    const K = sumToSingleDigit(E + F);

    let L;
    if (G === 0 && H === 0) {
        L = 5;
    } else {
        L = sumToSingleDigit(G + H);
    }

    // --- Main Inverted Triangle (Row 2) ---
    const M = sumToSingleDigit(I + J);
    const N = sumToSingleDigit(K + L);

    // --- Inner Upright Triangle (Core) ---
    const O = sumToSingleDigit(M + N);
    const P = sumToSingleDigit(N + O);
    const Q = sumToSingleDigit(M + O);

    // --- Bottom Output ---
    // Left Box: S, T, R
    const T = sumToSingleDigit(I + M);
    const S = sumToSingleDigit(J + M);
    const R = sumToSingleDigit(S + T);

    // Right Box: U, V, W
    const U = sumToSingleDigit(K + N);
    const V = sumToSingleDigit(L + N);
    const W = sumToSingleDigit(U + V);

    // --- Roots/Base ---
    // Root [Z] (Top Circle): I + L + O
    const Z = sumToSingleDigit(I + L + O);

    // Base [Y] (Bottom Circle): P + Q
    const Y = sumToSingleDigit(P + Q);

    // --- Hidden Numbers ---
    // H1 = M+M, H2 = N+N, H3 = O+O
    const H1 = sumToSingleDigit(M + M);
    const H2 = sumToSingleDigit(N + N);
    const H3 = sumToSingleDigit(O + O);

    // --- Stats ---
    // Five Elements Scope: I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, Y (User: "Only these")
    // Actually user previously said "IJKLMNOPQRSTUVWY" for Five Elements.
    // Wait, the new prompt says "Missing Numbers only look at IJKLMNO".
    // The previous prompt said "Five Elements looks at IJKLMNOPQRSTUVWY".
    // I will respect both specific scopes.

    const fiveElementsNumbers = [
        I, J, K, L, M, N, O, P, Q,
        R, S, T, U, V, W,
        Y
    ];

    const fiveElements = { metal: 0, water: 0, fire: 0, wood: 0, earth: 0 };
    fiveElementsNumbers.forEach(num => {
        if (num === 1 || num === 6) fiveElements.metal++;
        if (num === 2 || num === 7) fiveElements.water++;
        if (num === 3 || num === 8) fiveElements.fire++;
        if (num === 4 || num === 9) fiveElements.wood++;
        if (num === 5) fiveElements.earth++;
    });

    // Missing Numbers Scope: Only I, J, K, L, M, N, O (The 7 numbers of the inverted triangle)
    const missingScopeNumbers = [I, J, K, L, M, N, O];

    const missingNumbers = [];
    for (let i = 1; i <= 9; i++) {
        if (!missingScopeNumbers.includes(i)) {
            missingNumbers.push(i);
        }
    }

    return {
        values: {
            A, B, C, D, E, F, G, H,
            I, J, K, L, M, N, O, P, Q,
            R, S, T, U, V, W,
            Z, Y,
            H1, H2, H3
        },
        fiveElements,
        missingNumbers
    };
};
