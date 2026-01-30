import React, { useState } from 'react';
import DateInput from './components/DateInput';
import TriangleDisplay from './components/TriangleDisplay';
import StatsDisplay from './components/StatsDisplay';
import AnalysisDisplay from './components/AnalysisDisplay';
import { calculateLifeCode } from './utils/numerology';

function App() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState(null);

  // New state for Five Elements highlighting
  const [highlightedElement, setHighlightedElement] = useState(null);

  const handleDateChange = (d, m, y) => {
    setDay(d);
    setMonth(m);
    setYear(y);
    if (result) setResult(null);
  };

  const handleCalculate = () => {
    if (day && month && year) {
      const calcResult = calculateLifeCode(day, month, year);
      setResult(calcResult);
    } else {
      alert('請先選擇完整的出生日期');
    }
  };

  return (
    <>
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1rem 2rem' }}>
        <h1 style={{ margin: 0 }}>生命密碼計算器</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          探索您的數字易經生命信息
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <DateInput onDateChange={handleDateChange} />

        <button
          onClick={handleCalculate}
          className="search-btn"
        >
          查詢生命信息
        </button>
      </div>

      {result && (
        <>
          <div className="main-display-container">
            {/* TriangleDisplay */}
            <TriangleDisplay
              data={result}
              highlightedElement={highlightedElement}
            />
          </div>

          {/* Stats Display */}
          <StatsDisplay
            data={result}
            onElementHover={setHighlightedElement}
          />

          {/* Analysis Display - 13 Combinations */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <AnalysisDisplay data={result} />
          </div>
        </>
      )}
    </>
  );
}

export default App;
