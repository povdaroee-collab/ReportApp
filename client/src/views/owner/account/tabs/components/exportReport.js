import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// ទាញយករូបភាព
export const exportToImage = async (elementId, filename) => {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("រកមិនឃើញផ្ទាំងសម្រាប់ថតរូប");
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const link = document.createElement('a');
    link.download = filename + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
};

// ទាញយក PDF
export const exportToPDF = async (elementId, filename) => {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("រកមិនឃើញផ្ទាំងសម្រាប់បង្កើត PDF");
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename + '.pdf');
};

// ទាញយក Excel
export const exportToExcel = (tableInnerContent, filename) => {
    const fullHTML = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: 'Battambong', sans-serif; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #94a3b8; padding: 10px; vertical-align: middle; }
                .main-title { background-color: #0f172a; color: #ffffff; font-size: 20px; font-weight: bold; text-align: center; height: 50px; }
                .sub-title { background-color: #f1f5f9; color: #334155; font-size: 13px; text-align: center; height: 35px; font-weight: bold; }
                .header-row { background-color: #cbd5e1; color: #0f172a; font-weight: bold; text-align: center; height: 40px; }
                .data-row:nth-child(even) { background-color: #f8fafc; }
                .summary-label { background-color: #f1f5f9; font-weight: bold; text-align: right; color: #475569; }
                .grand-total-label { background-color: #1e293b; color: #ffffff; font-weight: bold; text-align: right; font-size: 16px; height: 45px; }
                .grand-total-val { background-color: #ecfdf5; color: #059669; font-weight: bold; text-align: right; font-size: 16px; border: 2px solid #059669; }
            </style>
        </head>
        <body>
            <table>${tableInnerContent}</table>
        </body>
        </html>
    `;
    const blob = new Blob([fullHTML], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};