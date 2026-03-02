import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const formatCurrency = (val, curr = "USD") => Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (curr === "USD" ? " $" : " ៛");

export const translateUnit = (unitVal, availableUnits) => {
  if (!unitVal) return "";
  const found = availableUnits.find((u) => u.value === unitVal);
  if (found) return found.label;
  const u = String(unitVal).toLowerCase().trim();
  if (u === "bottle" || u === "bottles") return "ដប";
  if (u === "pack" || u === "packs") return "កញ្ចប់";
  if (u === "case" || u === "cases") return "កេះ";
  if (u === "set" || u === "sets" || u === "ឈុត") return "ឈុត";
  return unitVal;
};

// ✅ Helper វៃឆ្លាត: ឆែកមើលគ្រប់ជ្រុងជ្រោយថាតើទំនិញនេះពិតជា "ឈុត" ដែរឬទេ
const isItemCombo = (item) => {
    if (!item) return false;
    if (item.isCombo === true || item.isCombo === "true") return true;
    if (item.type && String(item.type).includes('ឈុត')) return true;
    if (item.unit && (String(item.unit).toLowerCase() === 'set' || String(item.unit).includes('ឈុត'))) return true;
    if (item.name && String(item.name).includes('ឈុត')) return true; // 🚨 បើឈ្មោះមានពាក្យ "ឈុត" គឺចាត់ទុកជាឈុតភ្លាមៗ
    return false;
};

// ✅ Group Items By Name & Apply Smart Combo Logic
const groupItemsByName = (items) => {
    if (!items || items.length === 0) return [];
    const grouped = {};
    
    items.forEach(item => {
        const name = item.name || "មិនស្គាល់ឈ្មោះ";
        const comboFlag = isItemCombo(item);

        if (!grouped[name]) {
            grouped[name] = {
                name: name,
                qty: 0,
                total: 0,
                unit: comboFlag ? 'set' : item.unit,
                isCombo: comboFlag
            };
        }
        
        grouped[name].qty += Number(item.qty || 0);
        grouped[name].total += Number(item.total || (Number(item.price || 0) * Number(item.qty || 0)) || 0);
        
        // បើជួបទិន្នន័យចាស់ដែលវាអត់ស្គាល់ថាជាឈុត តែឆែកឃើញថាជាឈុត យើង Update ក្រុមនោះ
        if (comboFlag) {
            grouped[name].isCombo = true;
            grouped[name].unit = 'set';
        }
    });
    
    return Object.values(grouped);
};

// ==========================================
// 1. សម្រាប់គូរតារាងវិក្កយបត្រ (Row Tables)
// ==========================================
const generateTablePageHTML = (pageData, pageNum, totalPages, data, isNativePrint = false) => {
  const rows = pageData.rows || [];

  const renderRow = (item) => {
      let salesHTML = item.hasSales ? `<ul style="margin:0; padding-left:12px; font-size:12px; color:#334155; line-height:1.5;">` + Object.entries(item.unitCounts || {}).filter(([u, c]) => c > 0).map(([u, c]) => `<li><strong style="color:#0f172a;">${c.toLocaleString()}</strong> ${translateUnit(u, data.availableUnits)}</li>`).join("") + `</ul>` : `<span style="color:#94a3b8;">-</span>`;
      
      const groupedProductsList = groupItemsByName(item.productsList || []);
      
      // 💡 បង្ហាញឯកតាជា "ឈុត" ស្វ័យប្រវត្តិបើទំនិញនោះជាឈុត
      let productsHTML = item.hasSales && groupedProductsList.length > 0 ? `<ul style="margin:0; padding-left:15px; font-size:11px; color:#4338ca; line-height:1.6;">` + groupedProductsList.map((p) => {
          const unitLabel = p.isCombo ? 'ឈុត' : translateUnit(p.unit, data.availableUnits);
          return `<li><strong style="font-weight:900;">${p.name}</strong> <span style="color:#64748b;">(${p.qty} ${unitLabel})</span></li>`;
      }).join("") + `</ul>` : `<span style="color:#94a3b8;">-</span>`;
      
      let revenueHTML = item.hasSales ? `<div style="text-align:right;"><span style="color:#059669; font-size:14px; font-weight:900; display:block;">${item.revenueUSD.toLocaleString()} $</span><span style="color:#2563eb; font-size:12px; font-weight:bold; display:block; margin-top:2px;">${item.revenueKHR.toLocaleString()} ៛</span></div>` : `<div style="text-align:right; color:#94a3b8;">-</div>`;
      let catBadge = item.category === "បោះដុំ" ? `<span style="color:#7e22ce; font-weight:900; font-size:12px;">បោះដុំ</span>` : item.category === "លក់រាយ" ? `<span style="color:#475569; font-weight:bold; font-size:12px;">លក់រាយ</span>` : `<span style="color:#166534; font-weight:bold; font-size:12px;">សរុបរួម</span>`;
      if (!item.hasSales) catBadge = "-";

      return `
        <tr style="border-bottom: 1px solid #e2e8f0; ${!item.hasSales ? "background-color: #f8fafc;" : ""}">
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
            <thead style="background: #f1f5f9; color: #334155; font-size: 11px; font-weight: 900;">
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

  const mainTitle = pageNum === 1 ? `<div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #4f46e5;"><h1 style="font-size: 22px; font-weight: 900; color: #4338ca; margin: 0;">របាយការណ៍លក់សរុប</h1></div>` : "";

  const footerHTML = `
        <div style="margin-top: auto; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 10px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between; align-items: center;">
            <div><span style="background-color: #f8fafc; padding: 4px 10px; border-radius: 4px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 11px; font-weight: 900;">កាលបរិច្ឆេទ: ${data.reportDateLabel}</span></div>
            <div>ទំព័រទី ${pageNum} នៃ ${totalPages}</div>
        </div>
  `;

  const pageStyles = isNativePrint
    ? `width: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; min-height: 100vh; break-after: page; page-break-after: always; padding: 10mm; font-family: 'Battambang', sans-serif; line-height: 1.5;`
    : `width: 794px; height: 1123px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; font-family: 'Battambang', sans-serif; line-height: 1.5; position: relative;`;

  return `<div class="print-page" style="${pageStyles}"><div style="flex-grow: 1;">${mainTitle}${tableHTML}</div>${footerHTML}</div>`;
};

// ==========================================
// 2. ជំនួយការបង្កើត HTML សរុប (2-Column & Chunking)
// ==========================================
const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
    return chunks;
};

// ✅ តារាងសរុប ដែលមានការបញ្ជាក់ខ្នាត "ឈុត" យ៉ាងច្បាស់លាស់
const buildChunkTable = (items, data) => {
    if (!items || items.length === 0) return `<div style="font-size:11px; color:#94a3b8; padding: 10px 0; text-align:center;">- មិនមានទិន្នន័យ -</div>`;
    
    let rows = items.map(i => {
        // 💡 ការពារជាន់ទីពីរ: ឆែកមើលឈ្មោះម្តងទៀតទោះ Group រួចហើយក៏ដោយ
        const isCombo = i.isCombo || (i.name && String(i.name).includes('ឈុត'));
        const unitLabel = isCombo ? 'ឈុត' : translateUnit(i.unit, data.availableUnits);

        return `
        <tr style="border-bottom: 1px dashed #e2e8f0;">
            <td style="padding: 6px 4px; font-weight: bold; color: #334155; width: 60%;">${i.name}</td>
            <td style="padding: 6px 4px; text-align: center; color: #475569; width: 15%;">${i.qty} ${unitLabel}</td>
            <td style="padding: 6px 4px; text-align: right; font-weight: bold; color: #0f172a; width: 25%;">${formatCurrency(i.total)}</td>
        </tr>
        `;
    }).join('');

    return `
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead style="background: #f8fafc; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; color: #64748b;">
                <tr>
                    <th style="padding: 6px 4px; text-align: left;">ឈ្មោះទំនិញសរុប</th>
                    <th style="padding: 6px 4px; text-align: center;">ចំនួន</th>
                    <th style="padding: 6px 4px; text-align: right;">សរុបទឹកប្រាក់</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
};

const buildTotalBlock = (dataObj, titleStr) => {
    let totalWholesaleUSD = dataObj.paid.wholesaleUSD + dataObj.pending.wholesaleUSD + (dataObj.direct ? dataObj.direct.wholesaleUSD : 0);
    let totalWholesaleClients = dataObj.paid.wholesaleClients + dataObj.pending.wholesaleClients + (dataObj.direct ? dataObj.direct.wholesaleClients : 0);
    let totalRetailUSD = dataObj.paid.retailUSD + dataObj.pending.retailUSD + (dataObj.direct ? dataObj.direct.retailUSD : 0);
    let totalRetailClients = dataObj.paid.retailClients + dataObj.pending.retailClients + (dataObj.direct ? dataObj.direct.retailClients : 0);

    return `
        <div style="background: #1e293b; padding: 15px; border-radius: 8px; color: white; margin-top: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #818cf8; font-size: 13px;">= ${titleStr}</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
                <span style="color:#cbd5e1;">• លក់បោះដុំ (តម្លៃទំនិញសុទ្ធ):</span>
                <span><strong style="color: #fff; font-size:13px;">${formatCurrency(totalWholesaleUSD)}</strong> <span style="color:#94a3b8; font-size:10px;">(សរុប ${totalWholesaleClients} នាក់)</span></span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px;">
                <span style="color:#cbd5e1;">• លក់រាយ (តម្លៃទំនិញសុទ្ធ):</span>
                <span><strong style="color: #fff; font-size:13px;">${formatCurrency(totalRetailUSD)}</strong> <span style="color:#94a3b8; font-size:10px;">(សរុប ${totalRetailClients} នាក់)</span></span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 10px; border-top: 1px dashed #475569; font-size: 14px;">
                <span style="font-weight: 900; color: #fdba74;">🛵 ថ្លៃដឹកជញ្ជូនសរុប:</span>
                <span style="font-weight: 900; color: #fdba74; font-size: 16px;">${formatCurrency(dataObj.deliveryUSD)}</span>
            </div>
        </div>
    `;
};

// 💡 មុខងារវាស់កម្ពស់ HTML ពិតប្រាកដ ដើម្បីកាត់ទំព័រ
const generateSummaryPagesHTML = (data, isNativePrint = false) => {
    const rData = data.regionalReportSummary;
    const MAX_ROWS = 16; 

    let pages = [];
    let currentBlocks = [];

    const flushPage = () => {
        if (currentBlocks.length === 0) return;
        const footerHTML = `
            <div style="margin-top: auto; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 10px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; background: white; width: 100%;">
                <div><span style="background-color: #f8fafc; padding: 4px 10px; border-radius: 4px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 11px; font-weight: 900;">កាលបរិច្ឆេទ: ${data.reportDateLabel}</span></div>
                <div>របាយការណ៍តំបន់លម្អិត</div>
            </div>
        `;
        const pageStyles = isNativePrint
            ? `width: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; min-height: 100vh; break-after: page; page-break-after: always; padding: 10mm; font-family: 'Battambang', sans-serif; line-height: 1.6;`
            : `width: 794px; height: 1123px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; font-family: 'Battambang', sans-serif; line-height: 1.6; position: relative;`;

        pages.push(`<div class="print-page summary-page" style="${pageStyles}"><div style="flex-grow: 1;">${currentBlocks.join('')}</div>${footerHTML}</div>`);
        currentBlocks = [];
    };

    const buildRegionHeader = (title, icon, color, isContinued) => `
        <div style="background: ${color}; color: white; padding: 12px 20px; font-weight: 900; font-size: 16px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;">
            <span>${icon} ${title}</span>
            ${isContinued ? `<span style="font-size: 11px; background: rgba(255,255,255,0.25); padding: 2px 8px; border-radius: 12px;">(បន្តពីទំព័រមុន)</span>` : ''}
        </div>
    `;

    const measureDiv = document.createElement('div');
    measureDiv.style.width = '714px'; 
    measureDiv.style.fontFamily = "'Battambang', sans-serif";
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.top = '-9999px';
    document.body.appendChild(measureDiv);

    const MAX_CONTENT_HEIGHT = 920; 

    const processRegion = (title, icon, color, regionData, totalLabel) => {
        let isFirstInRegion = true;
        let blocksToAdd = [];

        const addStatusBlocks = (statusTitle, statusIcon, statusColor, sData) => {
            if (!sData || (sData.wholesaleUSD === 0 && sData.retailUSD === 0)) return;

            // ✅ Group ទំនិញតាមឈ្មោះ
            const groupedWholesale = groupItemsByName(sData.wholesaleItems || []);
            const groupedRetail = groupItemsByName(sData.retailItems || []);

            const wsChunks = chunkArray(groupedWholesale, MAX_ROWS);
            const rtChunks = chunkArray(groupedRetail, MAX_ROWS);
            const totalChunks = Math.max(wsChunks.length, rtChunks.length, 1);

            for (let i = 0; i < totalChunks; i++) {
                let wsHtml = ''; let rtHtml = '';
                
                if (i === 0) {
                    wsHtml += `<div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; background: #f1f5f9; padding: 6px 10px; border-radius: 4px; margin-bottom: 5px; color: #7e22ce;"><span>លក់បោះដុំ</span><span>${formatCurrency(sData.wholesaleUSD)} <span style="font-size:10px; font-weight:normal; color:#64748b;">(${sData.wholesaleClients} នាក់)</span></span></div>`;
                } else if (wsChunks[i] && wsChunks[i].length > 0) {
                    wsHtml += `<div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; background: #f1f5f9; padding: 6px 10px; border-radius: 4px; margin-bottom: 5px; color: #7e22ce;"><span>លក់បោះដុំ (បន្ត)</span></div>`;
                }
                wsHtml += buildChunkTable(wsChunks[i], data);

                if (i === 0) {
                    rtHtml += `<div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; background: #f1f5f9; padding: 6px 10px; border-radius: 4px; margin-bottom: 5px; color: #475569;"><span>លក់រាយ</span><span>${formatCurrency(sData.retailUSD)} <span style="font-size:10px; font-weight:normal; color:#64748b;">(${sData.retailClients} នាក់)</span></span></div>`;
                } else if (rtChunks[i] && rtChunks[i].length > 0) {
                    rtHtml += `<div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; background: #f1f5f9; padding: 6px 10px; border-radius: 4px; margin-bottom: 5px; color: #475569;"><span>លក់រាយ (បន្ត)</span></div>`;
                }
                rtHtml += buildChunkTable(rtChunks[i], data);

                let titleHtml = (i === 0) ? `<h4 style="margin: 0 0 10px 0; color: ${statusColor}; font-size: 14px; font-weight: 900; border-bottom: 2px solid ${statusColor}40; padding-bottom: 6px;">${statusIcon} ${statusTitle}</h4>` : '';

                blocksToAdd.push(`
                    <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 15px;">
                        ${titleHtml}
                        <div style="display: flex; gap: 15px;">
                            <div style="flex: 1; min-width: 0;">${wsHtml}</div>
                            <div style="width: 1px; background: #e2e8f0;"></div>
                            <div style="flex: 1; min-width: 0;">${rtHtml}</div>
                        </div>
                    </div>
                `);
            }
        };

        addStatusBlocks("ទំនិញបានទូទាត់រួច", "✔️", "#059669", regionData.paid);
        addStatusBlocks("ទំនិញមិនទាន់បានទូទាត់", "⏳", "#dc2626", regionData.pending);
        if (regionData.direct) addStatusBlocks("ទំនិញមកទិញផ្ទាល់", "🏬", "#0284c7", regionData.direct);
        
        blocksToAdd.push(buildTotalBlock(regionData, totalLabel));

        blocksToAdd.forEach((block) => {
            if (isFirstInRegion) {
                currentBlocks.push(buildRegionHeader(title, icon, color, false));
                isFirstInRegion = false;
            }
            measureDiv.innerHTML = currentBlocks.join('') + block;
            if (measureDiv.clientHeight > MAX_CONTENT_HEIGHT) {
                flushPage();
                currentBlocks.push(buildRegionHeader(title, icon, color, true));
            }
            currentBlocks.push(block);
        });
    };

    if (pages.length === 0) currentBlocks.push(`<div style="text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 20px;"><h3 style="font-size: 20px; font-weight: 900; color: #1e293b; margin: 0;">របាយការណ៍លម្អិតតាមមុខទំនិញ និងតំបន់</h3></div>`);
    
    processRegion("តំបន់ទិន្នន័យរួម (ភ្នំពេញ + ខេត្ត)", "📊", "#475569", rData.overall, "បូកសរុប ទំនិញបានទូទាត់រួច និង មិនទាន់បានទូទាត់");
    processRegion("តំបន់ទិន្នន័យ: រាជធានីភ្នំពេញ", "📍", "#0284c7", rData.phnomPenh, "បូកសរុប (ទូទាត់រួច + មិនទាន់ទូទាត់ + ទិញផ្ទាល់)");
    processRegion("តំបន់ទិន្នន័យ: តាមបណ្ដាលខេត្ត", "📍", "#d97706", rData.provinces, "បូកសរុប (ទូទាត់រួច + មិនទាន់ទូទាត់)");

    flushPage();
    document.body.removeChild(measureDiv);
    return pages;
};

// ==========================================
// 3. Execution (PDF & Native Print)
// ==========================================

export const executeNativePrint = (data) => {
  const dataWithIndex = data.filteredSellers.map((item, idx) => ({ ...item, printIndex: idx + 1 }));
  const ROWS_PER_PAGE = 15; 
  let tablePagesHTML = "";
  let totalTablePages = Math.ceil(dataWithIndex.length / ROWS_PER_PAGE);

  for (let i = 0; i < dataWithIndex.length; i += ROWS_PER_PAGE) {
    const chunk = dataWithIndex.slice(i, i + ROWS_PER_PAGE);
    tablePagesHTML += generateTablePageHTML({ rows: chunk }, (i / ROWS_PER_PAGE) + 1, totalTablePages, data, true);
  }

  const summaryPagesHTML = generateSummaryPagesHTML(data, true).join("");
  const contentHTML = `<div>${tablePagesHTML}${summaryPagesHTML}</div>`;

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
                body { font-family: 'Battambang', sans-serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; background-color: white; }
                table { width: 100%; border-collapse: collapse; }
                .print-page { width: 100% !important; min-height: 100vh !important; }
            </style>
        </head>
        <body>${contentHTML}</body>
        </html>
    `);
  doc.close();

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
    const pdfWidth = 210;
    const pageHeightA4 = 297;
    const pdf = new jsPDF("p", "mm", "a4");
    
    let allRows = [...data.filteredSellers];
    const ROWS_PER_PAGE = 10; 
    let tablePages = [];
    for (let i = 0; i < allRows.length; i += ROWS_PER_PAGE) {
      tablePages.push(allRows.slice(i, i + ROWS_PER_PAGE).map((r, idx) => ({...r, printIndex: i + idx + 1})));
    }

    for (let i = 0; i < tablePages.length; i++) {
      processingRef.value.message = `កំពុងគូរតារាងទំព័រទី ${i + 1}...`;
      printStagingEl.innerHTML = generateTablePageHTML({ rows: tablePages[i] }, i + 1, tablePages.length, data, false);
      await new Promise((r) => setTimeout(r, 600));

      const canvas = await html2canvas(printStagingEl.querySelector(".print-page"), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pageHeightA4);
      processingRef.value.progress = 10 + Math.round(((i + 1) / tablePages.length) * 30);
    }

    processingRef.value.message = `កំពុងគូររបាយការណ៍តំបន់លម្អិត...`;
    const summaryPagesArr = generateSummaryPagesHTML(data, false);

    for (let i = 0; i < summaryPagesArr.length; i++) {
        printStagingEl.innerHTML = summaryPagesArr[i];
        await new Promise((r) => setTimeout(r, 600)); 

        const canvas = await html2canvas(printStagingEl.querySelector(".print-page"), { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: "#ffffff" 
        });
        
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        
        pdf.addPage(); 
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pageHeightA4); 
        
        processingRef.value.progress += Math.round(60 / summaryPagesArr.length);
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