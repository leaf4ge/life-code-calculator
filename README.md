# Life Code Calculator (生命密碼計算器)

一個基於生命密碼學 (Life Code) 的線上計算工具，旨在幫助使用者分析其生命軌跡、性格特質、五行能量狀態及潛在天賦。

## 功能特色 (Features)

### 1. 核心計算
-   **幾何圖形分析**：自動繪製生命密碼三角形，計算主命數 (O) 及相關數值 (A-W, Z, Y, H1-H3)。
-   **隱藏號碼邏輯**：包含隱藏號 (H1-H3) 的計算與顯示。

### 2. 五行能量分析 (Five Elements)
-   **動態相生排序**：根據使用者 **主命數 (Life Path Number)** 的五行屬性，自動以 **「相生循環 (Generating Cycle)」** 排列五行順序 (自身 -> 子女/財富 -> 事業/伴侶 -> 官鬼/疾病 -> 父母貴人)。
-   **能量平衡檢測**：
    -   **自身 (Self)**：平衡點為 **4** (大於4過旺，小於4偏弱)。
    -   **其他 (Others)**：平衡點為 **3** (大於3過旺，小於3偏弱)。
    -   提供詳細的過旺/偏弱/缺失解釋。

### 3. 視覺化界面 (UI/UX)
-   **響應式設計 (Responsive)**：
    -   **電腦版**：採用左右分欄 (Flexbox)，左側為個人分析，右側為81組聯合解析。最大寬度 1600px，確保閱讀舒適。
    -   **手機版**：自動切換為單欄堆疊模式，優化行動裝置體驗。
-   **互動體驗**：Hover 數字可高亮關聯三角形區域及五行對應屬性。
-   **現代化風格**：採用 Glassmorphism (毛玻璃) 設計風格與流暢動畫。

## 技術棧 (Tech Stack)

-   **Frontend**: React 18, Vite
-   **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid)
-   **Language**: JavaScript (ES6+)

## 快速開始 (Getting Started)

1.  **安裝依賴**
    ```bash
    npm install
    ```

2.  **啟動開發伺服器**
    ```bash
    npm run dev
    ```

3.  **建構生產版本**
    ```bash
    npm run build
    ```

## 專案結構
-   `src/components/`: UI 組件 (AnalysisDisplay, GeometryDisplay, DateInput)
-   `src/utils/`: 核心計算邏輯 (numerology.js)
-   `src/data/`: 分析資料庫 (JSON 格式)

## License
MIT
