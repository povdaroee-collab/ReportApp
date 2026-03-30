import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// ==========================================
// 1. បង្កើតទម្រង់ HTML សម្រាប់វិក្កយបត្រតែមួយ (Single Invoice)
// ==========================================
export const generateSingleInvoiceHTML = (sale, helpers) => {
    let itemsHTML = '';
    sale.items.forEach((item, index) => {
        itemsHTML += `
            <tr style="border-bottom: 1px dashed #e2e8f0; ${sale.paymentStatus === 'CANCELED' ? 'opacity: 0.6;' : ''}">
                <td style="padding: 12px 10px; text-align: center; color: #64748b;">${index + 1}</td>
                <td style="padding: 12px 10px; font-weight: bold; color: #1e293b;">
                    ${item.name} <span style="font-size: 10px; color: #94a3b8; font-weight: normal;">(${helpers.checkIsWholesale(item.type) ? 'ដុំ' : 'រាយ'})</span>
                </td>
                <td style="padding: 12px 10px; text-align: center;">${item.qty} ${helpers.translateUnit(item.unit)}</td>
                <td style="padding: 12px 10px; text-align: right;">${item.price} $</td>
                <td style="padding: 12px 10px; text-align: right; font-weight: bold;">${item.price * item.qty} $</td>
            </tr>
        `;
    });

    const watermark = sale.paymentStatus === 'CANCELED' ? `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; font-weight: 900; color: rgba(225, 29, 72, 0.15); border: 8px solid rgba(225, 29, 72, 0.15); padding: 10px 40px; border-radius: 20px; z-index: 10; pointer-events: none;">CANCELED</div>` : '';

    return `
        <div class="invoice-container" style="width: 148mm; background: white; padding: 15mm; font-family: 'Battambang', sans-serif; color: #0f172a; box-sizing: border-box; margin: 0 auto; position: relative; overflow: hidden;">
            ${watermark}
            <div style="text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 26px; font-weight: 900;">វិក្កយបត្រ (INVOICE)</h2>
            </div>
            
            <table style="width: 100%; font-size: 13px; margin-bottom: 25px; border: none;">
                <tr>
                    <td style="width: 50%; vertical-align: top; line-height: 1.8;">
                        <div><strong>អតិថិជន:</strong> <span style="${sale.paymentStatus === 'CANCELED' ? 'text-decoration: line-through; color: #94a3b8;' : ''}">${sale.customerName}</span></div>
                        <div style="color: #475569;"><strong>ទូរស័ព្ទ:</strong> ${sale.customerPhone}</div>
                        <div style="color: #475569;"><strong>ទីតាំង:</strong> ${sale.location}</div>
                    </td>
                    <td style="width: 50%; vertical-align: top; text-align: right; line-height: 1.8;">
                        <div><strong>លេខ:</strong> ${sale.receiptId}</div>
                        <div style="color: #475569;"><strong>កាលបរិច្ឆេទ:</strong> ${helpers.formatKhmerDate(sale.createdAt)}</div>
                        <div style="color: #475569;"><strong>អ្នកលក់:</strong> ${sale.sellerName}</div>
                    </td>
                </tr>
            </table>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; position: relative; z-index: 20;">
                <thead style="background: #f1f5f9; border-top: 2px solid #94a3b8; border-bottom: 2px solid #94a3b8;">
                    <tr>
                        <th style="padding: 12px 10px; text-align: center; width: 8%;">#</th>
                        <th style="padding: 12px 10px; text-align: left;">បរិយាយទំនិញ</th>
                        <th style="padding: 12px 10px; text-align: center; width: 15%;">ចំនួន</th>
                        <th style="padding: 12px 10px; text-align: right; width: 20%;">តម្លៃឯកតា</th>
                        <th style="padding: 12px 10px; text-align: right; width: 20%;">សរុប</th>
                    </tr>
                </thead>
                <tbody>${itemsHTML}</tbody>
            </table>

            <table style="width: 100%; border: none; margin-top: 20px; position: relative; z-index: 20;">
                <tr>
                    <td style="width: 50%; vertical-align: top;">
                        <div style="font-size: 12px; color: #64748b; margin-bottom: 10px;">ការបង់ប្រាក់: <strong>${sale.paymentMethod}</strong></div>
                        ${sale.paymentStatus === 'CANCELED' ? `<div style="background: #fff1f2; padding: 10px; border-left: 3px solid #e11d48; border-radius: 4px; font-size: 12px; display: inline-block; color: #be123c;"><strong>មួលហេតុ Cancel:</strong> ${sale.cancelReason}</div>` : (sale.paymentNote ? `<div style="background: #f8fafc; padding: 10px; border-left: 3px solid #059669; border-radius: 4px; font-size: 12px; display: inline-block;"><strong>ចំណាំ:</strong> ${sale.paymentNote}</div>` : '')}
                    </td>
                    <td style="width: 50%; vertical-align: bottom; text-align: right;">
                        <div style="display: inline-block; min-width: 200px; text-align: right;">
                            ${sale.deliveryFee > 0 ? `<div style="font-size: 12px; color: #ea580c; margin-bottom: 5px;">ថ្លៃដឹកជញ្ជូន: <strong>${sale.deliveryFee} ${sale.deliveryCurrency === 'USD' ? '$' : '៛'}</strong></div>` : ''}
                            <div style="border-top: 2px solid #cbd5e1; padding-top: 10px; font-size: 20px; font-weight: 900; ${sale.paymentStatus === 'CANCELED' ? 'text-decoration: line-through; color: #94a3b8;' : ''}">
                                <span style="font-size: 14px; color: #64748b; margin-right: 15px; text-decoration: none;">សរុបរួម:</span> 
                                <span style="${sale.paymentStatus === 'CANCELED' ? '' : 'color: #059669;'}">${sale.totalAmount} $</span>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    `;
};

// ==========================================
// 2. ទាញយកវិក្កយបត្រជារូបភាព (Save as Image)
// ==========================================
export const saveInvoiceAsImage = async (sale, invoiceStaging, processing, emitAlert, helpers) => {
    processing.value = { active: true, message: 'កំពុងបង្កើតរូបភាពវិក្កយបត្រ...', progress: 50 };
    try {
        invoiceStaging.value.innerHTML = generateSingleInvoiceHTML(sale, helpers);
        // Wait for DOM & Fonts
        await new Promise(r => setTimeout(r, 600)); 
        const canvas = await html2canvas(invoiceStaging.value.querySelector('.invoice-container'), { scale: 3, useCORS: true, backgroundColor: "#ffffff" });
        
        const link = document.createElement('a');
        link.download = `Invoice_${sale.receiptId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        emitAlert('success', 'ជោគជ័យ', 'ទាញយករូបភាពវិក្កយបត្របានជោគជ័យ');
    } catch (error) {
        emitAlert('error', 'បរាជ័យ', 'មិនអាចបង្កើតរូបភាពបានទេ');
    } finally {
        if(invoiceStaging.value) invoiceStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};

// ==========================================
// 3. បង្កើតទម្រង់ HTML សម្រាប់របាយការណ៍សរុប (Report List)
// ==========================================
const generateReportHTML = (filteredSales, stats, dateTitle, helpers) => {
    let tableRows = '';
    filteredSales.forEach((sale, index) => {
        const isCanceled = sale.paymentStatus === 'CANCELED';
        let itemsHTML = (sale.items || []).map(p => 
            `<span style="display:inline-block; margin-right:5px; font-size:10px;">• ${p.name||'ទំនិញ'} <strong style="color:#4f46e5;">(${p.qty} ${helpers.translateUnit(p.unit)})</strong> [${helpers.checkIsWholesale(p.type) ? 'ដុំ' : 'រាយ'}]</span>`
        ).join('<br>');
        
        tableRows += `
            <tr style="border-bottom: 1px dashed #e2e8f0; page-break-inside: avoid; ${isCanceled ? 'opacity: 0.5; background-color: #f8fafc;' : ''}">
                <td style="padding: 8px; text-align: center;">${index + 1}</td>
                <td style="padding: 8px;">
                    <div style="font-weight: 900; color: #1e293b; ${isCanceled?'text-decoration:line-through;':''}">${sale.receiptId}</div>
                    <div style="font-size: 10px; color: #64748b;">${helpers.formatKhmerDateTime(sale.createdAt)}</div>
                </td>
                <td style="padding: 8px; ${isCanceled?'text-decoration:line-through;':''}">
                    <div style="font-weight: bold; color: #1e293b;">${sale.customerName || 'ទូទៅ'}</div>
                    <div style="font-size: 10px; color: #64748b;">${sale.location || '-'}</div>
                </td>
                <td style="padding: 8px;">${itemsHTML}</td>
                <td style="padding: 8px; text-align: right; color: #ea580c; font-weight: bold; font-size: 11px;">
                    ${Number(sale.deliveryFee) > 0 ? Number(sale.deliveryFee) + (sale.deliveryCurrency==='USD'?' $':' ៛') : '-'}
                </td>
                <td style="padding: 8px; text-align: right; font-weight: 900; color: ${isCanceled?'#94a3b8':'#059669'}; ${isCanceled?'text-decoration:line-through;':''}">
                    ${Number(sale.totalAmount).toLocaleString()} ${sale.currency==='USD'?'$':'៛'}
                </td>
            </tr>
        `;
    });

    return `
        <div class="print-layout" style="width: 1000px; padding: 40px; background: white; font-family: 'Battambang', sans-serif; color: #1e293b; box-sizing: border-box;">
            <div style="text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 15px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 900;">បញ្ជីវិក្កយបត្រ</h1>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px;">កាលបរិច្ឆេទ: <strong>${dateTitle}</strong></p>
            </div>
            
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; page-break-inside: avoid;">
                <div>
                    <p style="margin:0; font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">សរុបតម្លៃទំនិញ</p>
                    <p style="margin:0; font-size: 20px; font-weight: 900; color: #059669;">${stats.productsUSD.toLocaleString()} $</p>
                </div>
                <div style="border-left: 1px solid #cbd5e1; padding-left: 15px;">
                    <p style="margin:0; font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">ថ្លៃដឹកជញ្ជូនសរុប</p>
                    <p style="margin:0; font-size: 20px; font-weight: 900; color: #ea580c;">${stats.deliveryUSD.toLocaleString()} $</p>
                </div>
                <div style="border-left: 1px solid #cbd5e1; padding-left: 15px;">
                    <p style="margin:0; font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">វិក្កយបត្រជោគជ័យ</p>
                    <p style="margin:0; font-size: 20px; font-weight: 900; color: #4f46e5;">${filteredSales.filter(s=>s.paymentStatus!=='CANCELED').length}</p>
                </div>
            </div>

            <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 12px;">
                <thead style="background: #f1f5f9; color: #64748b; text-transform: uppercase; font-size: 10px; display: table-header-group;">
                    <tr>
                        <th style="padding: 10px; width: 5%; text-align: center;">#</th>
                        <th style="padding: 10px; width: 20%;">វិក្កយបត្រ & កាលបរិច្ឆេទ</th>
                        <th style="padding: 10px; width: 20%;">អតិថិជន & ទីតាំង</th>
                        <th style="padding: 10px; width: 35%;">មុខទំនិញ</th>
                        <th style="padding: 10px; width: 10%; text-align: right;">ថ្លៃដឹក</th>
                        <th style="padding: 10px; width: 10%; text-align: right;">សរុប ($)</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
    `;
};

// ==========================================
// 4. Print របាយការណ៍ (Print directly to Browser)
// ==========================================
export const handlePrint = (filteredSales, stats, dateTitle, helpers) => {
    const html = generateReportHTML(filteredSales, stats, dateTitle, helpers);
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html><head><title>Invoices List</title>
        <link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
            @page { size: A4 portrait; margin: 10mm; } 
            html, body { height: auto; margin: 0 !important; padding: 0 !important; background-color: white; font-family: 'Battambang', sans-serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
        </style>
        </head><body>${html}</body></html>
    `);
    doc.close();
    iframe.contentWindow.document.fonts.ready.then(() => {
        setTimeout(() => {
            iframe.contentWindow.focus(); iframe.contentWindow.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 500);
    });
};

// ==========================================
// 5. ទាញយករបាយការណ៍ជា PDF
// ==========================================
export const handlePDF = async (filteredSales, stats, dateTitle, printStaging, processing, emitAlert, helpers) => {
    processing.value = { active: true, message: 'កំពុងរៀបចំឯកសារ PDF...', progress: 30 };
    try {
        printStaging.value.innerHTML = generateReportHTML(filteredSales, stats, dateTitle, helpers);
        // Wait for render
        await new Promise(r => setTimeout(r, 600)); 
        const canvas = await html2canvas(printStaging.value.querySelector('.print-layout'), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4'); 
        
        const pdfWidth = 210; const pdfHeight = 297; const margin = 10;
        const printWidth = pdfWidth - (margin * 2); 
        const printHeight = pdfHeight - (margin * 2);
        const imgHeight = (canvas.height * printWidth) / canvas.width;
        
        processing.value.progress = 80;
        
        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, 'JPEG', margin, position, printWidth, imgHeight);
        heightLeft -= printHeight;
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, pdfHeight - margin, pdfWidth, margin, 'F');

        while (heightLeft > 0) {
            position = position - printHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', margin, position, printWidth, imgHeight);
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, pdfWidth, margin, 'F'); 
            pdf.rect(0, pdfHeight - margin, pdfWidth, margin, 'F');
            heightLeft -= printHeight;
        }
        
        pdf.save(`Invoices_List_${new Date().getTime()}.pdf`);
    } catch(e) {
        emitAlert('error', 'បរាជ័យ', 'មិនអាចទាញយក PDF បានទេ');
    } finally {
        if(printStaging.value) printStaging.value.innerHTML = '';
        processing.value.active = false;
    }
};