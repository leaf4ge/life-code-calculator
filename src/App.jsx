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

  // Ref for scrolling to results
  const resultsRef = React.useRef(null);

  // Stable handler to prevent unnecessary re-renders in DateInput
  const handleDateChange = React.useCallback((d, m, y) => {
    setDay(d);
    setMonth(m);
    setYear(y);
    setResult(null); // Always clear result on edit
  }, []);

  const handleCalculate = () => {
    if (day && month && year) {
      const calcResult = calculateLifeCode(day, month, year);
      setResult(calcResult);
      // Determine if numbers are valid (basic check)
      // Actually calculateLifeCode returns object even if NaNs in some edge cases but input fields should strictly be numbers now
    } else {
      alert('請先選擇完整的出生日期');
    }
  };

  // Auto-scroll when result is set
  React.useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: result ? 'flex-start' : 'center',
      alignItems: 'center',
      padding: '2rem', // Restore padding here
      gap: '1rem'
    }}>
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
        <div ref={resultsRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        </div>
      )}
    </div>
  );
}

export default App;
