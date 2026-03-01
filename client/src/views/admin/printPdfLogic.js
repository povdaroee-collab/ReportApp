import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const formatCurrency = (val, curr = "USD") => Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (curr === "USD" ? " $" : " ៛");

export const translateUnit = (unitVal, availableUnits) => {
  if (!unitVal) return "";
  const found = availableUnits.find((u) => u.value === unitVal);
  if (found) return found.label;
  const u = unitVal.toLowerCase().trim();
  if (u === "bottle" || u === "bottles") return "ដប";
  if (u === "pack" || u === "packs") return "កញ្ចប់";
  if (u === "case" || u === "cases") return "កេះ";
  if (u === "set" || u === "sets") return "ឈុត";
  return unitVal;
};

// ==========================================
// 1. សម្រាប់គូរតារាងវិក្កយបត្រ (Row Tables)
// ==========================================
const generateTablePageHTML = (pageData, pageNum, totalPages, data, isNativePrint = false) => {
  const rows = pageData.rows || [];

  const renderRow = (item) => {
      let salesHTML = item.hasSales ? `<ul style="margin:0; padding-left:12px; font-size:12px; color:#334155; line-height:1.5;">` + Object.entries(item.unitCounts || {}).filter(([u, c]) => c > 0).map(([u, c]) => `<li><strong style="color:#0f172a;">${c.toLocaleString()}</strong> ${translateUnit(u, data.availableUnits)}</li>`).join("") + `</ul>` : `<span style="color:#94a3b8;">-</span>`;
      let productsHTML = item.hasSales && item.productsList && item.productsList.length > 0 ? `<ul style="margin:0; padding-left:15px; font-size:11px; color:#4338ca; line-height:1.6;">` + item.productsList.map((p) => `<li><strong style="font-weight:900;">${p.name}</strong> <span style="color:#64748b;">(${p.qty} ${translateUnit(p.unit, data.availableUnits)})</span></li>`).join("") + `</ul>` : `<span style="color:#94a3b8;">-</span>`;
      let revenueHTML = item.hasSales ? `<div style="text-align:right;"><span style="color:#059669; font-size:14px; font-weight:900; display:block;">${item.revenueUSD.toLocaleString()} $</span><span style="color:#2563eb; font-size:12px; font-weight:bold; display:block; margin-top:2px;">${item.revenueKHR.toLocaleString()} ៛</span></div>` : `<div style="text-align:right; color:#94a3b8;">-</div>`;
      let catBadge = item.category === "បោះដុំ" ? `<span style="color:#7e22ce; font-weight:900; font-size:12px;">បោះដុំ</span>` : item.category === "លក់រាយ" ? `<span style="color:#475569; font-weight:bold; font-size:12px;">លក់រាយ</span>` : `<span style="color:#166534; font-weight:bold; font-size:12px;">សរុបរួម</span>`;
      if (!item.hasSales) catBadge = "-";

      return `
        <tr style="break-inside: avoid; border-bottom: 1px solid #e2e8f0; ${!item.hasSales ? "background-color: #f8fafc;" : ""}">
            <td style="padding: 12px 8px; text-align: center; font-weight: 900; color: #64748b; font-size: 12px;">${item.printIndex}</td>
            <td style="padding: 12px 8px; width: 22%;"><p style="font-weight:900; color:#1e293b; font-size:13px; margin:0;">${item.fullName}</p><p style="color:#64748b; font-size:11px; margin:2px 0 0 0;">ID: ${item.idNumber || "N/A"}</p></td>
            <td style="padding: 12px 8px; text-align: center; width: 10%;">${catBadge}</td>
            <td style="padding: 12px 8px; width: 33%;">${productsHTML}</td>
            <td style="padding: 12px 8px; width: 12%;">${salesHTML}</td>
            <td style="padding: 12px 8px; text-align: center; font-weight: bold; color: #334155; font-size: 12px; width: 10%;">${item.hasSales ? item.totalClients.toLocaleString() + " នាក់" : "-"}</td>
            <td style="padding: 12px 8px; width: 13%;">${revenueHTML}</td>
        </tr>`;
  };

  let tableHTML = `
        <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">
            <thead style="background: #f1f5f9; color: #334155; font-size: 11px; font-weight: 900; display: table-header-group;">
                <tr>
                    <th style="padding: 10px 8px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th>
                    <th style="padding: 10px 8px; width: 22%; border-bottom: 2px solid #cbd5e1;">តំណាងលក់</th>
                    <th style="padding: 10px 8px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">ប្រភេទ</th>
                    <th style="padding: 10px 8px; width: 33%; border-bottom: 2px solid #cbd5e1;">មុខទំនិញ</th>
                    <th style="padding: 10px 8px; width: 12%; border-bottom: 2px solid #cbd5e1;">បរិមាណ</th>
                    <th style="padding: 10px 8px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th>
                    <th style="padding: 10px 8px; width: 13%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th>
                </tr>
            </thead>
            <tbody>${rows.map(renderRow).join("")}</tbody>
        </table>
  `;

  const mainTitle = pageNum === 1 ? `<div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #4f46e5;"><h1 style="font-size: 22px; font-weight: 900; color: #4338ca; margin: 0; text-align: center; width: 100%;">របាយការណ៍លក់សរុប</h1></div>` : "";

  const footerHTML = `
        <div style="margin-top: auto; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; background: white; width: 100%;">
            <div>
                <span style="background-color: #f8fafc; padding: 3px 8px; border-radius: 4px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 11px; font-weight: 900;">កាលបរិច្ឆេទ: ${data.reportDateLabel}</span>
            </div>
            <div>ទំព័រទី ${pageNum} នៃ ${totalPages}</div>
        </div>
  `;

  const pageStyles = isNativePrint
    ? `width: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; min-height: 100vh; padding: 10mm; font-family: 'Battambang', sans-serif; line-height: 1.5; page-break-after: always;`
    : `width: 794px; min-height: 1123px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; font-family: 'Battambang', sans-serif; line-height: 1.5; position: relative;`;

  return `
        <div class="print-page" style="${pageStyles}">
            <div style="padding-bottom: 20px; flex-grow: 1;">
                ${mainTitle}
                ${tableHTML}
            </div>
            ${footerHTML}
        </div>
  `;
};

// ==========================================
// 2. សម្រាប់គូរប្រអប់សរុប (Summary Blocks)
// ==========================================
const buildItemsTable = (items, data) => {
    if (!items || items.length === 0) return `<div style="font-size:11px; color:#94a3b8; padding-top:5px;">មិនមានទិន្នន័យទំនិញ</div>`;
    let rows = items.map(i => `
        <tr style="border-bottom: 1px dashed #e2e8f0;">
            <td style="padding: 6px 8px; font-weight: bold; color: #334155;">${i.name}</td>
            <td style="padding: 6px 8px; text-align: center; color: #475569;">${i.qty} ${translateUnit(i.unit, data.availableUnits)}</td>
            <td style="padding: 6px 8px; text-align: right; color: #475569;">${formatCurrency(i.unitPrice)}</td>
            <td style="padding: 6px 8px; text-align: right; font-weight: bold; color: #0f172a;">${formatCurrency(i.total)}</td>
        </tr>
    `).join('');
    return `
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; background: white; margin-top: 8px; margin-bottom: 12px;">
            <thead style="background: #f8fafc; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; color: #64748b;">
                <tr>
                    <th style="padding: 6px 8px; text-align: left;">មុខទំនិញ</th>
                    <th style="padding: 6px 8px; text-align: center;">ចំនួន</th>
                    <th style="padding: 6px 8px; text-align: right;">តម្លៃឯកតា</th>
                    <th style="padding: 6px 8px; text-align: right;">សរុប</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
};

const buildTypeSection = (title, usd, clients, items, data) => {
    if (usd === 0 && (!items || items.length === 0)) return "";
    return `
        <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #1e293b; font-weight: bold; background: #f1f5f9; padding: 6px 10px; border-radius: 4px;">
                <span>${title}</span>
                <span>${formatCurrency(usd)} <span style="font-size:11px; font-weight:normal; color:#64748b;">(អតិថិជន ${clients} នាក់)</span></span>
            </div>
            ${buildItemsTable(items, data)}
        </div>
    `;
};

const buildMainSection = (title, icon, color, dataObj, data, bgColor = "white", isTotal = false) => {
    if (!dataObj || (dataObj.wholesaleUSD === 0 && dataObj.retailUSD === 0)) return "";
    return `
        <div style="margin-bottom: 18px; background: ${bgColor}; padding: 15px; border-radius: 8px; border: 1px solid ${isTotal ? '#94a3b8' : '#e2e8f0'}; page-break-inside: avoid;">
            <h4 style="margin: 0 0 12px 0; color: ${color}; font-size: 15px; border-bottom: 2px solid ${color}40; padding-bottom: 8px;">${icon} ${title}</h4>
            ${buildTypeSection("លក់បោះដុំ (មិនបូកថ្លៃដឹក)", dataObj.wholesaleUSD, dataObj.wholesaleClients, dataObj.wholesaleItems, data)}
            ${buildTypeSection("លក់រាយ (មិនបូកថ្លៃដឹក)", dataObj.retailUSD, dataObj.retailClients, dataObj.retailItems, data)}
        </div>
    `;
};

const buildTotalBlock = (dataObj, titleStr) => {
    let totalWholesaleUSD = dataObj.paid.wholesaleUSD + dataObj.pending.wholesaleUSD + (dataObj.direct ? dataObj.direct.wholesaleUSD : 0);
    let totalWholesaleClients = dataObj.paid.wholesaleClients + dataObj.pending.wholesaleClients + (dataObj.direct ? dataObj.direct.wholesaleClients : 0);
    let totalRetailUSD = dataObj.paid.retailUSD + dataObj.pending.retailUSD + (dataObj.direct ? dataObj.direct.retailUSD : 0);
    let totalRetailClients = dataObj.paid.retailClients + dataObj.pending.retailClients + (dataObj.direct ? dataObj.direct.retailClients : 0);

    return `
        <div style="background: #1e293b; padding: 15px; border-radius: 8px; color: white; page-break-inside: avoid;">
            <h4 style="margin: 0 0 12px 0; color: #818cf8; font-size: 13px;">= ${titleStr}</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px;">
                <span style="color:#cbd5e1;">• លក់បោះដុំ (តម្លៃទំនិញសុទ្ធ):</span>
                <span><strong style="color: #fff; font-size:13px;">${formatCurrency(totalWholesaleUSD)}</strong> <span style="color:#94a3b8; font-size:10px;">(សរុប ${totalWholesaleClients} នាក់)</span></span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px;">
                <span style="color:#cbd5e1;">• លក់រាយ (តម្លៃទំនិញសុទ្ធ):</span>
                <span><strong style="color: #fff; font-size:13px;">${formatCurrency(totalRetailUSD)}</strong> <span style="color:#94a3b8; font-size:10px;">(សរុប ${totalRetailClients} នាក់)</span></span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 12px; border-top: 1px dashed #475569; font-size: 14px;">
                <span style="font-weight: 900; color: #fdba74;">🛵 ថ្លៃដឹកជញ្ជូនសរុប:</span>
                <span style="font-weight: 900; color: #fdba74; font-size: 16px;">${formatCurrency(dataObj.deliveryUSD)}</span>
            </div>
        </div>
    `;
};

// ជំនួយការគូរ HTML សម្រាប់តំបន់នីមួយៗ (ប្រើសម្រាប់ទាំង PDF និង Print)
const generateSummaryRegionHTML = (type, data, pageNum, totalPages, isNativePrint = false) => {
    const rData = data.regionalReportSummary;
    let content = '';

    if (type === 'overall') {
        content = `
            <h3 style="font-size: 20px; font-weight: 900; color: #1e293b; text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 25px;">របាយការណ៍លម្អិតតាមមុខទំនិញ និងតំបន់</h3>
            <div style="border: 2px solid #475569; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
                <div style="background: #475569; color: white; padding: 12px 15px; font-weight: 900; font-size: 16px;">📊 តំបន់ទិន្នន័យរួម (រាជធានីភ្នំពេញ + តាមបណ្ដាលខេត្ត)</div>
                <div style="padding: 20px; background: white;">
                    ${buildMainSection("ទំនិញបានទូទាត់រួច", "✔️", "#059669", rData.overall.paid, data, "#ecfdf5")}
                    ${buildMainSection("ទំនិញមិនទាន់បានទូទាត់", "⏳", "#dc2626", rData.overall.pending, data, "#fef2f2")}
                    ${buildTotalBlock(rData.overall, "បូកសរុប ទំនិញបានទូទាត់រួច និង ទំនិញមិនទាន់បានទូទាត់")}
                </div>
            </div>
        `;
    } else if (type === 'pp') {
        content = `
            <div style="border: 2px solid #0284c7; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
                <div style="background: #0284c7; color: white; padding: 12px 15px; font-weight: 900; font-size: 16px;">📍 តំបន់ទិន្នន័យ: រាជធានីភ្នំពេញ</div>
                <div style="padding: 20px; background: #f0f9ff;">
                    ${buildMainSection("ទំនិញបានទូទាត់រួច", "✔️", "#059669", rData.phnomPenh.paid, data, "white")}
                    ${buildMainSection("ទំនិញមិនទាន់បានទូទាត់", "⏳", "#dc2626", rData.phnomPenh.pending, data, "white")}
                    ${buildMainSection("ទំនិញមកទិញផ្ទាល់", "🏬", "#0284c7", rData.phnomPenh.direct, data, "white")}
                    ${buildTotalBlock(rData.phnomPenh, "បូកសរុប (ទូទាត់រួច + មិនទាន់ទូទាត់ + ទិញផ្ទាល់)")}
                </div>
            </div>
        `;
    } else if (type === 'prov') {
        content = `
            <div style="border: 2px solid #d97706; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
                <div style="background: #d97706; color: white; padding: 12px 15px; font-weight: 900; font-size: 16px;">📍 តំបន់ទិន្នន័យ: តាមបណ្ដាលខេត្ត <span style="font-size:11px; font-weight:normal;">(មិនមានទំនិញទិញផ្ទាល់)</span></div>
                <div style="padding: 20px; background: #fffbeb;">
                    ${buildMainSection("ទំនិញបានទូទាត់រួច", "✔️", "#059669", rData.provinces.paid, data, "white")}
                    ${buildMainSection("ទំនិញមិនទាន់បានទូទាត់", "⏳", "#dc2626", rData.provinces.pending, data, "white")}
                    ${buildTotalBlock(rData.provinces, "បូកសរុប (ទូទាត់រួច + មិនទាន់ទូទាត់)")}
                </div>
            </div>
        `;
    }

    const footerHTML = `
        <div style="margin-top: auto; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; background: white; width: 100%;">
            <div>
                <span style="background-color: #f8fafc; padding: 3px 8px; border-radius: 4px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 11px; font-weight: 900;">កាលបរិច្ឆេទ: ${data.reportDateLabel}</span>
            </div>
            <div>ទំព័រទី ${pageNum} នៃ ${totalPages}</div>
        </div>
    `;

    const pageStyles = isNativePrint
    ? `width: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; min-height: 100vh; padding: 10mm; font-family: 'Battambang', sans-serif; line-height: 1.5; page-break-after: always;`
    : `width: 794px; min-height: 1123px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; font-family: 'Battambang', sans-serif; line-height: 1.5; position: relative;`;

    return `
        <div class="print-page" style="${pageStyles}">
            <div style="padding-bottom: 20px; flex-grow: 1;">
                ${content}
            </div>
            ${footerHTML}
        </div>
    `;
};

// ==========================================
// 3. Execution (PDF & Native Print)
// ==========================================

export const executeNativePrint = (data) => {
  const dataWithIndex = data.filteredSellers.map((item, idx) => ({ ...item, printIndex: idx + 1 }));
  
  // ១. បង្កើត HTML សម្រាប់តារាងវិក្កយបត្រ
  let allRows = [...dataWithIndex];
  const ROWS_PER_PAGE = 15; // សម្រាប់ Print យើងអាចដាក់បានច្រើនជួរជាង PDF
  let tablePagesHTML = "";
  let totalTablePages = Math.ceil(allRows.length / ROWS_PER_PAGE);
  let totalPagesCount = totalTablePages + 3; // បូកបញ្ជូលទំព័រសរុប ៣ ទៀត

  for (let i = 0; i < allRows.length; i += ROWS_PER_PAGE) {
    const chunk = allRows.slice(i, i + ROWS_PER_PAGE);
    tablePagesHTML += generateTablePageHTML({ rows: chunk }, (i / ROWS_PER_PAGE) + 1, totalPagesCount, data, true);
  }

  // ២. បង្កើត HTML សម្រាប់របាយការណ៍សរុបទាំង ៣ តំបន់
  let summaryHTML = "";
  const summaryTypes = ['overall', 'pp', 'prov'];
  let currentSummaryPageNum = totalTablePages + 1;

  for (let type of summaryTypes) {
      summaryHTML += generateSummaryRegionHTML(type, data, currentSummaryPageNum, totalPagesCount, true);
      currentSummaryPageNum++;
  }

  // រួមបញ្ចូលគ្នា
  const contentHTML = `
    <div>
        ${tablePagesHTML}
        ${summaryHTML}
    </div>
  `;

  // បង្កើត Iframe សម្រាប់ Print
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
        <html>
        <head>
            <title>Sales_Report_${data.dateFilterType}</title>
            <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 portrait; margin: 0; }
                body { 
                    font-family: 'Battambang', sans-serif; 
                    -webkit-print-color-adjust: exact !important; 
                    print-color-adjust: exact !important; 
                    margin: 0; 
                    background-color: white; 
                }
                table { width: 100%; border-collapse: collapse; }
                tr { page-break-inside: avoid; page-break-after: auto; }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
            </style>
        </head>
        <body>${contentHTML}</body>
        </html>
    `);
  doc.close();

  // រង់ចាំឱ្យ Load ចប់សព្វគ្រប់ ទើបហៅ Print Command
  iframe.contentWindow.document.fonts.ready.then(() => {
    setTimeout(() => { 
        iframe.contentWindow.focus(); 
        iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    }, 800);
  });
};

export const generatePDF = async (data, printStagingEl, processingRef) => {
  processingRef.value = { active: true, message: "កំពុងបំបែកទិន្នន័យជាទំព័រ...", progress: 10 };

  try {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeightA4 = 297;
    
    let allRows = [...data.filteredSellers];
    const ROWS_PER_PAGE = 10; 
    let tablePages = [];
    
    for (let i = 0; i < allRows.length; i += ROWS_PER_PAGE) {
      const chunk = allRows.slice(i, i + ROWS_PER_PAGE).map((r, idx) => ({...r, printIndex: i + idx + 1}));
      tablePages.push(chunk);
    }

    let totalPagesCount = tablePages.length + 3; 

    // គូរទំព័រតារាង
    for (let i = 0; i < tablePages.length; i++) {
      processingRef.value.message = `កំពុងគូរតារាងទំព័រទី ${i + 1}...`;
      
      printStagingEl.innerHTML = generateTablePageHTML({ rows: tablePages[i] }, i + 1, totalPagesCount, data, false);
      await new Promise((r) => setTimeout(r, 600));

      const canvas = await html2canvas(printStagingEl.querySelector(".print-page"), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeightA4);
      processingRef.value.progress = 10 + Math.round(((i + 1) / tablePages.length) * 40);
    }

    // គូរទំព័រសរុប (Summary Page) ដោយបំបែកជា ៣ ទំព័រដាច់ៗពីគ្នា 
    const summaryTypes = ['overall', 'pp', 'prov'];
    let currentSummaryPageNum = tablePages.length + 1;

    for (let type of summaryTypes) {
        processingRef.value.message = `កំពុងគូររបាយការណ៍តំបន់...`;
        
        printStagingEl.innerHTML = generateSummaryRegionHTML(type, data, currentSummaryPageNum, totalPagesCount, false);
        await new Promise((r) => setTimeout(r, 800)); 

        const canvas = await html2canvas(printStagingEl.querySelector(".print-page"), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        pdf.addPage(); 
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeightA4); 
        
        currentSummaryPageNum++;
        processingRef.value.progress += 15;
    }
    
    processingRef.value.progress = 100;
    processingRef.value.message = "កំពុងរក្សាទុកឯកសារ PDF...";
    
    pdf.save(`Sales_Report_${data.dateFilterType}.pdf`);

    setTimeout(() => { processingRef.value.active = false; }, 800);
  } catch (e) {
    console.error(e);
    processingRef.value.active = false;
    alert("មានបញ្ហាក្នុងការទាញយក PDF សូមព្យាយាមម្តងទៀត។");
  }
};