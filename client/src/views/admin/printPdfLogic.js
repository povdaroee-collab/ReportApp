import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const formatCurrency = (val, curr) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (curr === 'USD' ? ' $' : ' ៛');

export const translateUnit = (unitVal, availableUnits) => {
  if (!unitVal) return '';
  const found = availableUnits.find(u => u.value === unitVal);
  if (found) return found.label;
  const u = unitVal.toLowerCase().trim();
  if (u === 'bottle' || u === 'bottles') return 'ដប';
  if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
  if (u === 'case' || u === 'cases') return 'កេះ';
  if (u === 'set' || u === 'sets') return 'ឈុត';
  return unitVal; 
};

const generatePageHTML = (pageData, pageNum, totalPages, isNativePrint = false, data) => {
    const rows = pageData.rows || [];
    const summary = isNativePrint ? { top: true, overall: true, region: true } : (pageData.summary || {});

    const renderRow = (item) => {
        let salesHTML = '';
        if (item.hasSales) {
            salesHTML = `<div style="overflow: hidden;">` + 
                Object.entries(item.unitCounts || {}).filter(([u, c]) => c > 0).map(([u, c]) => 
                    `<div style="display: inline-block; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 3px 6px; margin: 0 4px 4px 0;">
                        <span style="font-weight: 900; color: #1e293b; font-size: 11px;">${c.toLocaleString()}</span>
                        <span style="color: #64748b; font-size: 10px; font-weight: bold; margin-left: 2px;">${translateUnit(u, data.availableUnits)}</span>
                     </div>`
                ).join('') + `</div>`;
        } else {
            salesHTML = `<span style="font-size: 11px; font-weight: bold; color: #94a3b8;">-</span>`;
        }

        let productsHTML = '';
        if (item.hasSales && item.productsList && item.productsList.length > 0) {
            productsHTML = `<div style="overflow: hidden;">` + 
                item.productsList.map(p => 
                    `<div style="display: inline-block; color: #4338ca; background-color: #eef2ff; border: 1px solid #e0e7ff; padding: 3px 6px; border-radius: 4px; font-size: 9px; margin: 0 4px 4px 0;">
                        <strong style="font-weight: 900;">${p.name}</strong> <span style="color: #6366f1;">• ${p.qty} ${translateUnit(p.unit, data.availableUnits)}</span>
                    </div>`
                ).join('') + `</div>`;
        } else {
            productsHTML = `<span style="font-size: 11px; font-weight: bold; color: #94a3b8;">-</span>`;
        }

        let revenueHTML = '';
        if (item.hasSales) {
            revenueHTML = `
                <div style="text-align: right;">
                    <span style="color:#059669; font-size:14px; font-weight:900; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; display: inline-block;">${item.revenueUSD.toLocaleString()} $</span><br/>
                    <span style="color:#2563eb; font-size:10px; font-weight:bold; padding-right: 2px; display: inline-block; margin-top: 3px;">${item.revenueKHR.toLocaleString()} ៛</span>
                </div>`;
        } else {
            revenueHTML = `<div style="text-align: right; color:#94a3b8; font-weight:bold; font-size:12px;">-</div>`;
        }

        let catBadge = '';
        if (item.category === 'បោះដុំ') {
            catBadge = `<span style="background-color: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; padding: 3px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">បោះដុំ</span>`;
        } else if (item.category === 'លក់រាយ') {
            catBadge = `<span style="background-color: #f8fafc; color: #475569; border: 1px solid #e2e8f0; padding: 3px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">លក់រាយ</span>`;
        } else if (item.category === 'សរុបរួម') {
            catBadge = `<span style="background-color: #f0fdf4; color: #166534; border: 1px solid #dcfce7; padding: 3px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">សរុបរួម</span>`;
        } else {
            catBadge = '-';
        }

        const dealerBadge = item.role === 'dealer' 
            ? `<span style="background-color: #fffbeb; color: #d97706; border: 1px solid #fde68a; padding: 1px 4px; border-radius: 3px; font-size: 8px; font-weight: 900; vertical-align: middle; margin-left: 4px;">DEALER</span>` 
            : '';

        return `
            <tr style="break-inside: avoid; page-break-inside: avoid; ${!item.hasSales ? 'background-color: #f8fafc;' : 'border-bottom: 1px solid #f1f5f9;'}">
                <td style="padding: 12px 8px; text-align: center; vertical-align: top; font-weight: 900; color: #94a3b8; font-size: 12px;">${item.printIndex}</td>
                <td style="padding: 12px 8px; vertical-align: top;">
                    <p style="font-weight: bold; color: #1e293b; font-size: 13px; margin: 0; display: flex; align-items: center;">
                        ${item.fullName} ${dealerBadge}
                    </p>
                    <p style="font-family: monospace; color: #64748b; font-size: 10px; margin: 2px 0 0 0;">ID: ${item.idNumber || 'N/A'}</p>
                </td>
                <td style="padding: 12px 8px; vertical-align: top; text-align: center;">${item.hasSales ? catBadge : '-'}</td>
                <td style="padding: 12px 8px; vertical-align: top;">${productsHTML}</td>
                <td style="padding: 12px 8px; vertical-align: top;">${salesHTML}</td>
                <td style="padding: 12px 8px; text-align: center; vertical-align: top; font-weight: bold; color: #334155; font-size: 12px;">
                    ${item.hasSales ? item.totalClients.toLocaleString() + ' នាក់' : '-'}
                </td>
                <td style="padding: 12px 8px; vertical-align: top;">${revenueHTML}</td>
            </tr>
        `;
    };

    let summarySectionHTML = '';
    if (summary.top || summary.overall || summary.region) {
        
        let topGrandTotalHTML = '';
        if (summary.top) {
            const unitsArray = Object.entries(data.grandTotals.all.units || {});
            let unitRows = '';
            for (let i = 0; i < unitsArray.length; i += 2) {
                const [u1, c1] = unitsArray[i];
                const item2 = unitsArray[i + 1];
                const cell1 = `
                    <td style="width: 50%; padding: 4px 8px 4px 0; vertical-align: top;">
                        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; overflow: hidden;">
                            <span style="color: #475569; font-size: 12px; font-weight: bold; float: left;">${translateUnit(u1, data.availableUnits)}</span>
                            <span style="font-weight: 900; color: #0f172a; font-size: 14px; float: right;">${c1.toLocaleString()}</span>
                            <div style="clear: both;"></div>
                        </div>
                    </td>`;
                const cell2 = item2 ? `
                    <td style="width: 50%; padding: 4px 0 4px 8px; vertical-align: top;">
                        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; overflow: hidden;">
                            <span style="color: #475569; font-size: 12px; font-weight: bold; float: left;">${translateUnit(item2[0], data.availableUnits)}</span>
                            <span style="font-weight: 900; color: #0f172a; font-size: 14px; float: right;">${item2[1].toLocaleString()}</span>
                            <div style="clear: both;"></div>
                        </div>
                    </td>` : `<td style="width: 50%;"></td>`;
                unitRows += `<tr>${cell1}${cell2}</tr>`;
            }
            
            const unitsTableHTML = unitsArray.length > 0 
                ? `<table style="width: 100%; border-collapse: collapse; border: none;"><tbody>${unitRows}</tbody></table>`
                : `<p style="color: #94a3b8; font-size: 12px; margin: 0;">គ្មានទិន្នន័យ</p>`;

            const categoryLabel = data.activeCategory === 'all' ? '' : `- ${data.activeCategory}`;

            let breakdownHTML = '';
            if (data.activeCategory === 'all') {
                breakdownHTML = `
                    <table style="width: 100%; margin-top: 15px; border-top: 1px dashed #cbd5e1; padding-top: 15px;">
                        <tr>
                            <td style="width: 48%; background: white; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; vertical-align: top;">
                                <p style="font-size: 10px; color: #64748b; font-weight: 900; margin: 0 0 8px 0;">លក់រាយ (RETAIL)</p>
                                <p style="margin: 0; font-size: 16px; font-weight: 900; color: #059669;">${data.grandTotals.retail.usd.toLocaleString()} $</p>
                                <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: bold; color: #2563eb;">${data.grandTotals.retail.khr.toLocaleString()} ៛</p>
                                <div style="margin-top: 8px; border-top: 1px solid #f1f5f9; padding-top: 8px;">
                                    <p style="margin: 0; font-size: 10px; font-weight: bold; color: #475569;">អតិថិជន: ${data.grandTotals.retail.clients.toLocaleString()} នាក់</p>
                                    <p style="margin: 2px 0 0 0; font-size: 10px; font-weight: bold; color: #475569;">បរិមាណលក់: ${data.grandTotals.retail.totalUnitsCount.toLocaleString()}</p>
                                </div>
                            </td>
                            <td style="width: 4%;"></td>
                            <td style="width: 48%; background: white; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; vertical-align: top;">
                                <p style="font-size: 10px; color: #64748b; font-weight: 900; margin: 0 0 8px 0;">បោះដុំ (WHOLESALE)</p>
                                <p style="margin: 0; font-size: 16px; font-weight: 900; color: #059669;">${data.grandTotals.wholesale.usd.toLocaleString()} $</p>
                                <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: bold; color: #2563eb;">${data.grandTotals.wholesale.khr.toLocaleString()} ៛</p>
                                <div style="margin-top: 8px; border-top: 1px solid #f1f5f9; padding-top: 8px;">
                                    <p style="margin: 0; font-size: 10px; font-weight: bold; color: #475569;">អតិថិជន: ${data.grandTotals.wholesale.clients.toLocaleString()} នាក់</p>
                                    <p style="margin: 2px 0 0 0; font-size: 10px; font-weight: bold; color: #475569;">បរិមាណលក់: ${data.grandTotals.wholesale.totalUnitsCount.toLocaleString()}</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                `;
            }

            topGrandTotalHTML = `
                <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="width: 55%; vertical-align: top; padding-right: 15px;">
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px;">
                                <h3 style="font-size: 14px; font-weight: 900; color: #1e293b; margin: 0 0 15px 0;">
                                    <span style="display:inline-block; background: #e0e7ff; color: #4f46e5; padding: 2px 6px; border-radius: 6px; margin-right: 5px;">📊</span> សរុបបរិមាណលក់តាមប្រភេទ ${categoryLabel}
                                </h3>
                                ${unitsTableHTML}
                            </div>
                        </td>
                        <td style="width: 45%; vertical-align: top;">
                            <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                                <div style="background: #1e293b; padding: 12px 15px;">
                                    <h3 style="font-size: 14px; font-weight: 900; color: white; margin: 0;">សរុបរួម (Grand Total) ${categoryLabel}</h3>
                                </div>
                                <div style="padding: 15px; background: #f8fafc;">
                                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                                        <tr>
                                            <td style="padding-bottom: 8px; border-bottom: 1px dashed #cbd5e1; color: #64748b; font-weight: bold;">អតិថិជនសរុប:</td>
                                            <td style="padding-bottom: 8px; border-bottom: 1px dashed #cbd5e1; text-align: right; font-weight: 900; color: #0f172a;">${data.grandTotals.all.clients.toLocaleString()} នាក់</td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top: 8px; padding-bottom: 8px; border-bottom: 1px dashed #cbd5e1; color: #64748b; font-weight: bold;">សរុបទំនិញ (Products):</td>
                                            <td style="padding-top: 8px; padding-bottom: 8px; border-bottom: 1px dashed #cbd5e1; text-align: right; font-weight: 900; color: #059669; font-size: 14px;">
                                                ${data.grandTotals.all.usd.toLocaleString()} $
                                                ${data.grandTotals.all.khr > 0 ? `<br/><span style="color: #2563eb; font-size: 11px;">${data.grandTotals.all.khr.toLocaleString()} ៛</span>` : ''}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top: 8px; padding-bottom: 8px; border-bottom: 1px solid #cbd5e1; color: #64748b; font-weight: bold;">ថ្លៃដឹកជញ្ជូន (Delivery):</td>
                                            <td style="padding-top: 8px; padding-bottom: 8px; border-bottom: 1px solid #cbd5e1; text-align: right; font-weight: 900; color: #ea580c;">
                                                ${data.grandTotals.all.deliveryUSD > 0 ? data.grandTotals.all.deliveryUSD.toLocaleString() + ' $' : ''}
                                                ${data.grandTotals.all.deliveryUSD > 0 && data.grandTotals.all.deliveryKHR > 0 ? ' | ' : ''}
                                                ${data.grandTotals.all.deliveryKHR > 0 ? data.grandTotals.all.deliveryKHR.toLocaleString() + ' ៛' : ''}
                                                ${data.grandTotals.all.deliveryUSD === 0 && data.grandTotals.all.deliveryKHR === 0 ? '0 $' : ''}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top: 10px; color: #0f172a; font-weight: 900; font-size: 13px;">សរុប (Total):</td>
                                            <td style="padding-top: 10px; text-align: right; font-weight: 900; color: #2563eb; font-size: 16px;">
                                                ${(data.grandTotals.all.usd + data.grandTotals.all.deliveryUSD).toLocaleString()} $
                                                ${(data.grandTotals.all.khr + data.grandTotals.all.deliveryKHR) > 0 ? `<br/><span style="font-size: 12px;">${(data.grandTotals.all.khr + data.grandTotals.all.deliveryKHR).toLocaleString()} ៛</span>` : ''}
                                            </td>
                                        </tr>
                                    </table>
                                    ${breakdownHTML}
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            `;
        }

        let overallHTML = '';
        if (summary.overall) {
            let retailHTML = '';
            if (data.itemizedSummary.overall.retail.length > 0) {
                retailHTML = `
                    <div style="margin-bottom: 15px;">
                        <div style="background: #e0e7ff; color: #4f46e5; font-size: 12px; font-weight: bold; padding: 6px 12px; border-radius: 6px; display: inline-block; margin-bottom: 10px;">សរុបការលក់រាយ និងឈុត (Retail & Combo)</div>
                        <table style="width: 100%; border-collapse: collapse; font-size: 11px; background: white;">
                            <thead style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; color: #64748b;">
                                <tr>
                                    <th style="padding: 6px; text-align: left;">មុខទំនិញ</th>
                                    <th style="padding: 6px; text-align: center;">ចំនួន</th>
                                    <th style="padding: 6px; text-align: right;">តម្លៃឯកតា</th>
                                    <th style="padding: 6px; text-align: right;">សរុប</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.itemizedSummary.overall.retail.map(item => `
                                    <tr style="border-bottom: 1px dashed #e2e8f0;">
                                        <td style="padding: 6px; font-weight: bold; color: #334155;">${item.name}</td>
                                        <td style="padding: 6px; text-align: center; color: #475569;">${item.qty} ${translateUnit(item.unit, data.availableUnits)}</td>
                                        <td style="padding: 6px; text-align: right; color: #475569;">${formatCurrency(item.unitPrice, item.currency)}</td>
                                        <td style="padding: 6px; text-align: right; font-weight: bold; color: #059669;">${formatCurrency(item.total, item.currency)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }

            let wholesaleHTML = '';
            if (data.itemizedSummary.overall.wholesale.length > 0) {
                wholesaleHTML = `
                    <div style="margin-bottom: 15px;">
                        <div style="background: #f3e8ff; color: #7e22ce; font-size: 12px; font-weight: bold; padding: 6px 12px; border-radius: 6px; display: inline-block; margin-bottom: 10px;">សរុបការបោះដុំ (Wholesale)</div>
                        <table style="width: 100%; border-collapse: collapse; font-size: 11px; background: white;">
                            <thead style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; color: #64748b;">
                                <tr>
                                    <th style="padding: 6px; text-align: left;">មុខទំនិញ</th>
                                    <th style="padding: 6px; text-align: center;">ចំនួន</th>
                                    <th style="padding: 6px; text-align: right;">តម្លៃឯកតា</th>
                                    <th style="padding: 6px; text-align: right;">សរុប</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.itemizedSummary.overall.wholesale.map(item => `
                                    <tr style="border-bottom: 1px dashed #e2e8f0;">
                                        <td style="padding: 6px; font-weight: bold; color: #334155;">${item.name}</td>
                                        <td style="padding: 6px; text-align: center; color: #475569;">${item.qty} ${translateUnit(item.unit, data.availableUnits)}</td>
                                        <td style="padding: 6px; text-align: right; color: #475569;">${formatCurrency(item.unitPrice, item.currency)}</td>
                                        <td style="padding: 6px; text-align: right; font-weight: bold; color: #059669;">${formatCurrency(item.total, item.currency)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }
            overallHTML = retailHTML + wholesaleHTML;
        }

        let regionHTML = '';
        if (summary.region) {
            const buildRegionHTML = (title, regionData, colorHex, bgColor) => {
                if (regionData.retail.length === 0 && regionData.wholesale.length === 0) return '';
                let html = `
                    <div style="margin-top: 25px; padding: 15px; border-radius: 12px; border: 1px solid ${colorHex}40; background: ${bgColor}; break-inside: avoid; page-break-inside: avoid;">
                        <table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid ${colorHex}40; padding-bottom: 10px;">
                            <tr>
                                <td style="text-align: left;">
                                    <h3 style="font-size: 15px; font-weight: 900; color: ${colorHex}; margin: 0;">📍 ${title}</h3>
                                </td>
                                <td style="text-align: right;">
                                    <span style="background: white; color: #475569; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 1px solid #cbd5e1;">
                                        អតិថិជនសរុប: ${regionData.clientCount} នាក់
                                    </span>
                                </td>
                            </tr>
                        </table>
                `;
                const buildTable = (typeTitle, items) => {
                    if (items.length === 0) return '';
                    return `
                        <div style="margin-bottom: 15px;">
                            <h4 style="font-size: 12px; font-weight: bold; color: #64748b; margin: 0 0 8px 0;">${typeTitle}</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 11px; background: white;">
                                <thead style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; color: #64748b;">
                                    <tr>
                                        <th style="padding: 6px; text-align: left;">មុខទំនិញ</th>
                                        <th style="padding: 6px; text-align: center;">ចំនួន</th>
                                        <th style="padding: 6px; text-align: right;">តម្លៃឯកតា</th>
                                        <th style="padding: 6px; text-align: right;">សរុប</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${items.map(item => `
                                        <tr style="border-bottom: 1px dashed #e2e8f0;">
                                            <td style="padding: 6px; font-weight: bold; color: #334155;">${item.name}</td>
                                            <td style="padding: 6px; text-align: center; color: #475569;">${item.qty} ${translateUnit(item.unit, data.availableUnits)}</td>
                                            <td style="padding: 6px; text-align: right; color: #475569;">${formatCurrency(item.unitPrice, item.currency)}</td>
                                            <td style="padding: 6px; text-align: right; font-weight: bold; color: ${colorHex};">${formatCurrency(item.total, item.currency)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                };
                html += buildTable('លក់រាយ (Retail)', regionData.retail);
                html += buildTable('បោះដុំ (Wholesale)', regionData.wholesale);
                html += `
                        <div style="text-align: right; padding-top: 10px; font-size: 12px; color: ${colorHex}; border-top: 1px dashed ${colorHex}40;">
                            <table style="width: 100%; border: none;">
                                <tr>
                                    <td style="text-align: right; color: #64748b; font-weight: bold; padding-bottom: 4px;">សរុបទំនិញតំបន់នេះ:</td>
                                    <td style="text-align: right; font-weight: 900; color: ${colorHex}; padding-bottom: 4px; width: 180px;">${regionData.usd.toLocaleString()} $ ${regionData.khr > 0 ? `| ${regionData.khr.toLocaleString()} ៛` : ''}</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right; color: #64748b; font-weight: bold; padding-bottom: 4px;">ថ្លៃដឹកជញ្ជូន:</td>
                                    <td style="text-align: right; font-weight: 900; color: #ea580c; padding-bottom: 4px;">${regionData.deliveryUSD > 0 ? regionData.deliveryUSD.toLocaleString() + ' $' : '0 $'} ${regionData.deliveryKHR > 0 ? `| ${regionData.deliveryKHR.toLocaleString()} ៛` : ''}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                `;
                return html;
            };

            regionHTML += buildRegionHTML('រាជធានីភ្នំពេញ', data.itemizedSummary.phnomPenh, '#0284c7', '#f0f9ff');
            regionHTML += buildRegionHTML('តាមបណ្តាខេត្ត', data.itemizedSummary.provinces, '#ea580c', '#fff7ed');
            
            // 🔥 បន្ថែមការបង្ហាញតំបន់ ភ្ញៀវទិញផ្ទាល់ ចូលទៅក្នុង Print/PDF 🔥
            regionHTML += buildRegionHTML('ភ្ញៀវទិញផ្ទាល់ (Walk-in)', data.itemizedSummary.directWalkIn, '#059669', '#ecfdf5');
        }

        let titleHTML = '';
        if (summary.overall || summary.region) {
            titleHTML = `<h3 style="font-size: 18px; font-weight: 900; color: #1e293b; margin-bottom: 20px; text-align: center;">របាយការណ៍លម្អិតតាមមុខទំនិញ និងតំបន់</h3>`;
        }

        let topMargin = summary.top ? '30px' : '0px';
        let topPadding = summary.top ? '20px' : '0px';
        let topBorder = summary.top ? '2px solid #cbd5e1' : 'none';

        summarySectionHTML = `
            <div style="margin-top: ${topMargin}; padding-top: ${topPadding}; border-top: ${topBorder}; width: 100%;">
                ${topGrandTotalHTML}
                ${titleHTML}
                ${overallHTML}
                ${regionHTML}
            </div>
        `;
    }

    let tableHTML = '';
    if (rows.length > 0) {
        const tableHeader = `
            <thead style="color: #334155; font-size: 11px; font-weight: 900; display: table-header-group;">
                <tr>
                    <th style="padding: 12px 8px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th>
                    <th style="padding: 12px 8px; width: 18%; border-bottom: 2px solid #cbd5e1;">តំណាងលក់</th>
                    <th style="padding: 12px 8px; width: 8%; text-align: center; border-bottom: 2px solid #cbd5e1;">ប្រភេទ</th>
                    <th style="padding: 12px 8px; width: 27%; border-bottom: 2px solid #cbd5e1;">មុខទំនិញ</th>
                    <th style="padding: 12px 8px; width: 15%; border-bottom: 2px solid #cbd5e1;">បរិមាណលក់</th>
                    <th style="padding: 12px 8px; width: 12%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th>
                    <th style="padding: 12px 8px; width: 15%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th>
                </tr>
            </thead>
        `;

        tableHTML = `
            <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">
                ${tableHeader}
                <tbody>${rows.map(renderRow).join('')}</tbody>
            </table>
        `;
    }

    const pageStyles = isNativePrint
        ? `width: 100%; box-sizing: border-box; font-family: 'Battambang', 'Kantumruy Pro', sans-serif; line-height: 1.5; padding: 15px;`
        : `width: 794px; min-height: 1123px; height: auto; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; font-family: 'Battambang', 'Kantumruy Pro', sans-serif; line-height: 1.5; position: relative; overflow: hidden;`;

    const mainTitle = (pageNum === 1 || isNativePrint) 
        ? `<div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #4f46e5;"><h1 style="font-size: 24px; font-weight: 900; color: #4338ca; margin: 0; text-align: center; width: 100%;">របាយការណ៍លក់សរុប</h1></div>` 
        : '';

    const footerHTML = isNativePrint ? '' : `
        <div style="margin-top: auto; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 11px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; background: white; width: 100%;">
            <div>
                <span style="background-color: #f8fafc; padding: 3px 8px; border-radius: 4px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 11px; font-weight: 900;">កាលបរិច្ឆេទ: ${data.reportDateLabel}</span>
                <span style="margin-left: 10px;">ថ្ងៃបញ្ចេញរបាយការណ៍ • ${new Date().toLocaleString('km-KH')}</span>
            </div>
            <div>ទំព័រទី ${pageNum} នៃ ${totalPages}</div>
        </div>
    `;

    return `
        <div class="print-page" style="${pageStyles}">
            <div style="padding-bottom: 60px;">
                ${mainTitle}
                ${tableHTML}
                ${summarySectionHTML}
            </div>
            ${footerHTML}
        </div>
    `;
};

export const executeNativePrint = (data) => {
    const dataWithIndex = data.filteredSellers.map((item, idx) => ({ ...item, printIndex: idx + 1 }));
    const contentHTML = generatePageHTML({ rows: dataWithIndex, summary: { top: true, overall: true, region: true } }, 1, 1, true, data);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
        <head>
            <title>Sales_Report_${data.dateFilterType}</title>
            <link href="https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 portrait; margin: 0; }
                body { font-family: 'Battambong', 'Kantumruy Pro', sans-serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; padding: 15mm; background-color: white; }
                table { width: 100%; border-collapse: collapse; }
                tr    { page-break-inside: avoid; page-break-after: auto; }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
            </style>
        </head>
        <body>${contentHTML}</body>
        </html>
    `);
    doc.close();

    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus(); 
        iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    });
};

export const generatePDF = async (data, printStagingEl, processingRef) => {
    processingRef.value = { active: true, message: 'កំពុងបំបែកទិន្នន័យ...', progress: 10 };
    
    try {
        const pages = [];
        let currentPageRows = [];
        
        const MAX_PAGE_HEIGHT = 920; 
        const PAGE_TITLE_HEIGHT = 120; 
        const TABLE_HEADER_HEIGHT = 60;

        let currentHeight = PAGE_TITLE_HEIGHT + TABLE_HEADER_HEIGHT; 
        let rowCounter = 1;
        let allRows = [...data.filteredSellers];

        for (let row of allRows) {
            let numProducts = row.productsList ? row.productsList.length : 1;
            let rowHeight = 70 + (numProducts * 30); 

            if (currentHeight + rowHeight > MAX_PAGE_HEIGHT && currentPageRows.length > 0) {
                pages.push({ rows: currentPageRows, summary: {} });
                currentPageRows = [];
                currentHeight = TABLE_HEADER_HEIGHT; 
            }
            
            currentPageRows.push({ ...row, printIndex: rowCounter++ });
            currentHeight += rowHeight;
        }

        let grandTotalUnitCount = Object.keys(data.grandTotals.all.units || {}).length;
        let hTop = 260 + (Math.ceil(grandTotalUnitCount / 2) * 45); 

        let countOverallItems = data.itemizedSummary.overall.retail.length + data.itemizedSummary.overall.wholesale.length;
        let hOverall = countOverallItems === 0 ? 0 : 120 + (countOverallItems * 35); 

        let countPPItems = data.itemizedSummary.phnomPenh.retail.length + data.itemizedSummary.phnomPenh.wholesale.length;
        let hPP = countPPItems === 0 ? 0 : 130 + (countPPItems * 35); 

        let countProvItems = data.itemizedSummary.provinces.retail.length + data.itemizedSummary.provinces.wholesale.length;
        let hProv = countProvItems === 0 ? 0 : 130 + (countProvItems * 35); 

        // 🔥 Estimate Height សម្រាប់ តំបន់ ទិញផ្ទាល់ 🔥
        let countDirectItems = data.itemizedSummary.directWalkIn.retail.length + data.itemizedSummary.directWalkIn.wholesale.length;
        let hDirect = countDirectItems === 0 ? 0 : 130 + (countDirectItems * 35);

        let hRegion = hPP + hProv + hDirect;
        if (hRegion > 0) hRegion += 60; 

        let summaryObj = { top: false, overall: false, region: false };

        if (currentHeight + hTop <= MAX_PAGE_HEIGHT) {
            summaryObj.top = true;
            currentHeight += hTop;
        } else {
            pages.push({ rows: currentPageRows, summary: summaryObj });
            currentPageRows = [];
            summaryObj = { top: true, overall: false, region: false };
            currentHeight = hTop;
        }

        if (hOverall > 0) {
            if (currentHeight + hOverall <= MAX_PAGE_HEIGHT) {
                summaryObj.overall = true;
                currentHeight += hOverall;
            } else {
                pages.push({ rows: currentPageRows, summary: summaryObj });
                currentPageRows = [];
                summaryObj = { top: false, overall: true, region: false };
                currentHeight = hOverall;
            }
        }

        if (hRegion > 0) {
            if (currentHeight + hRegion <= MAX_PAGE_HEIGHT) {
                summaryObj.region = true;
                currentHeight += hRegion;
            } else {
                pages.push({ rows: currentPageRows, summary: summaryObj });
                currentPageRows = [];
                summaryObj = { top: false, overall: false, region: true };
                currentHeight = hRegion;
            }
        }

        pages.push({ rows: currentPageRows, summary: summaryObj });

        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = 210; 
        const pdfHeightA4 = 297; 
        
        for (let i = 0; i < pages.length; i++) {
            processingRef.value.message = `កំពុងថតចម្លងទំព័រទី ${i+1} នៃ ${pages.length}...`;
            printStagingEl.innerHTML = generatePageHTML(pages[i], i + 1, pages.length, false, data);
            
            await new Promise(r => setTimeout(r, 800)); 

            const canvas = await html2canvas(printStagingEl.querySelector('.print-page'), { 
                scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff"
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            if (i > 0) pdf.addPage();
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeightA4);
            processingRef.value.progress = 10 + Math.round(((i + 1) / pages.length) * 80);
        }

        processingRef.value.message = 'កំពុងរក្សាទុកឯកសារ...';
        processingRef.value.progress = 100;
        pdf.save(`Sales_Report_${data.dateFilterType}.pdf`);
        
    } catch(e) {
        console.error(e);
        throw e;
    }
};