import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DownloadButton = ({ targetRef }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownloadPdf = async () => {
        if (!targetRef.current) return;

        try {
            setIsGenerating(true);

            // 1. Clone the element to ensure full capture
            const element = targetRef.current;
            const clone = element.cloneNode(true);

            // 2. Style the clone to force full width/height and avoid viewport clipping
            clone.style.position = 'absolute';
            clone.style.top = '-9999px';
            clone.style.left = '0';
            clone.style.width = element.scrollWidth + 'px';
            clone.style.height = 'auto'; // Let it expand naturally
            clone.style.zIndex = '-1';
            clone.style.background = '#0f172a'; // Ensure background for dark mode

            // Copy canvas content manually (as cloneNode doesn't copy canvas state)
            const canvases = element.querySelectorAll('canvas');
            const cloneCanvases = clone.querySelectorAll('canvas');
            canvases.forEach((canvas, index) => {
                const cloneCanvas = cloneCanvases[index];
                if (cloneCanvas) {
                    const ctx = cloneCanvas.getContext('2d');
                    ctx.drawImage(canvas, 0, 0);
                }
            });

            document.body.appendChild(clone);

            // Wait for render
            await new Promise(r => setTimeout(r, 100));

            // 3. Capture the full content
            const canvas = await html2canvas(clone, {
                scale: 2, // High resolution
                useCORS: true,
                backgroundColor: '#0f172a',
                logging: false,
                width: clone.scrollWidth,
                height: clone.scrollHeight,
                windowWidth: clone.scrollWidth,
                windowHeight: clone.scrollHeight
            });

            // 4. Clean up DOM
            document.body.removeChild(clone);

            // 5. Generate PDF with Pagination (A4)
            const imgData = canvas.toDataURL('image/png');

            // A4 Dimensions in mm
            const pdfWidth = 210;
            const pdfHeight = 297;

            const pdf = new jsPDF('p', 'mm', 'a4');

            // Calculate dimensions of the image on the PDF
            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = imgProps.width;
            const imgHeight = imgProps.height;

            // Scale content to fit A4 width
            const contentWidth = pdfWidth;
            const contentHeight = (imgHeight * contentWidth) / imgWidth;

            let heightLeft = contentHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, contentWidth, contentHeight);
            heightLeft -= pdfHeight;

            // Loop for subsequent pages
            while (heightLeft > 0) {
                position = heightLeft - contentHeight; // e.g., -297, -594...
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, contentWidth, contentHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save('life-code-analysis.pdf');

        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('PDF 生成失敗，請稍後再試。');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="download-btn"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 1000,
                background: 'var(--accent-cyan)',
                color: '#0f172a',
                border: 'none',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 4px 15px rgba(34, 211, 238, 0.4)',
                cursor: isGenerating ? 'wait' : 'pointer',
                opacity: isGenerating ? 0.7 : 1,
                transition: 'all 0.3s ease'
            }}
            title="下載 PDF"
        >
            {isGenerating ? (
                // Loading Spinner
                <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                </svg>
            ) : (
                // Download Icon
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16L7 11L8.41 9.59L11 12.17V4H13V12.17L15.59 9.59L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="currentColor" />
                </svg>
            )}
        </button>
    );
};

export default DownloadButton;
