import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { nextTick } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

// ==========================================
// 🌟 1. HELPER FUNCTIONS 🌟
// ==========================================
export function fC(val) {
    return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fQ(val) {
    return Number(val || 0).toLocaleString('en-US');
}

export function formatCurrency(val, curr = "USD") {
    return Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (curr === "USD" ? " $" : " ៛");
}

export function translateUnit(unitVal, availableUnits) {
    if (!unitVal) return "";
    const safeVal = String(unitVal);
    const found = availableUnits ? availableUnits.find((u) => u.value === safeVal) : null;
    if (found) return found.label;
    const u = safeVal.toLowerCase().trim();
    if (u === "bottle" || u === "bottles") return "ដប";
    if (u === "pack" || u === "packs") return "កញ្ចប់";
    if (u === "case" || u === "cases") return "កេះ";
    if (u === "set" || u === "sets" || u === "ឈុត") return "ឈុត";
    return safeVal;
}

export function isItemCombo(item) {
    if (!item) return false;
    if (item.isCombo === true || item.isCombo === "true") return true;
    if (item.type && String(item.type).includes('ឈុត')) return true;
    if (item.unit && (String(item.unit).toLowerCase() === 'set' || String(item.unit).includes('ឈុត'))) return true;
    if (item.name && String(item.name).includes('ឈុត')) return true; 
    return false;
}

export function groupItemsByName(items) {
    if (!items || items.length === 0) return [];
    const grouped = {};
    
    items.forEach(item => {
        if (item.paymentStatus === 'CANCELED' || item.paymentStatus === 'Canceled' || item.status === 'CANCELED') return;

        const name = item.name || "មិនស្គាល់ឈ្មោះ";
        const comboFlag = isItemCombo(item);

        if (!grouped[name]) {
            grouped[name] = { name: name, qty: 0, total: 0, unit: comboFlag ? 'set' : item.unit, isCombo: comboFlag };
        }
        
        grouped[name].qty += Number(item.qty || 0);
        grouped[name].total += Number(item.total || (Number(item.price || 0) * Number(item.qty || 0)) || 0);
        
        if (comboFlag) {
            grouped[name].isCombo = true;
            grouped[name].unit = 'set';
        }
    });
    
    return Object.values(grouped);
}

let cachedCombos = null;
let cachedStocks = null;

const fetchCombosAndStocks = async () => {
    if (!cachedCombos) {
        const cSnap = await getDocs(collection(db, 'combos'));
        cachedCombos = cSnap.docs.map(d => ({id: d.id, ...d.data()}));
    }
    if (!cachedStocks) {
        const sSnap = await getDocs(collection(db, 'stocks'));
        cachedStocks = sSnap.docs.map(d => ({id: d.id, ...d.data()}));
    }
    return { allCombos: cachedCombos, allStocks: cachedStocks };
};

// ==========================================
// 🌟 2. មុខងារទាញយកទំនិញលម្អិត (ដោះស្រាយបញ្ហាគុណចំនួនទំនិញទ្វេដង) 🌟
// ==========================================
export function getDetailedProductsSummary(item, data, allCombos, allStocks) {
    let productsToProcess = [];
    
    if (data.allSales && data.allSales.length > 0) {
        const targetId = item.originalSellerId || item.id || item.originalAdminId;
        const validSales = data.allSales.filter(s => 
            (s.createdBy === targetId || s.uid === targetId) && 
            s.paymentStatus !== 'CANCELED' && s.paymentStatus !== 'Canceled'
        );

        // ✅ ដំណោះស្រាយ: ចម្រាញ់យកវិក្កយបត្រកុំឱ្យស្ទួន (Deduplicate receipts)
        const uniqueReceipts = new Map();
        validSales.forEach(sale => {
            const receiptId = sale.originalReceiptId || (sale.id ? String(sale.id).split('_')[0] : null);
            if (receiptId) {
                uniqueReceipts.set(receiptId, sale);
            }
        });

        // ទាញយក items ចេញពីវិក្កយបត្រដែលមិនស្ទួន
        Array.from(uniqueReceipts.values()).forEach(sale => {
            (sale.items || []).forEach(prod => {
                productsToProcess.push({ ...prod, saleCurrency: sale.currency });
            });
        });

    } else if (item.productsList && item.productsList.length > 0) {
        productsToProcess = item.productsList.filter(p => p.paymentStatus !== 'CANCELED' && p.paymentStatus !== 'Canceled');
    }

    if (productsToProcess.length === 0) return [];
    const productSummary = {};

    productsToProcess.forEach(prod => {
        const pName = prod.name || 'មិនស្គាល់';
        let priceUsd = Number(prod.price || prod.unitPrice || prod.retailPrice || 0);
        let itemTotalUsd = Number(prod.total || prod.totalAmount || prod.amount || prod.usd || 0);
        let prodQty = Number(prod.qty || 1);
        
        if (itemTotalUsd === 0 && priceUsd > 0) itemTotalUsd = priceUsd * prodQty;
        if (priceUsd === 0 && itemTotalUsd > 0) priceUsd = itemTotalUsd / prodQty;
        
        let curr = String(prod.currency || prod.saleCurrency || '').toUpperCase();
        if (curr === 'KHR' || curr === '៛' || String(prod.price).includes('៛')) { 
            priceUsd /= 4000; 
            itemTotalUsd /= 4000; 
        }

        if (isItemCombo(prod) && allCombos && allStocks) {
            const combo = allCombos.find(c => c.id === prod.id || c.name === prod.name);
            if (combo && combo.items && combo.items.length > 0) {
                let totalStandardValue = 0;
                const subItemsData = combo.items.map(subItem => {
                    const stock = allStocks.find(s => s.id === subItem.productId);
                    const standardPrice = stock ? Number(stock.retailPrice || 0) : 0;
                    const value = standardPrice * Number(subItem.qty || 1);
                    totalStandardValue += value;
                    return { stock, subItemQty: Number(subItem.qty || 1), standardValue: value };
                });

                subItemsData.forEach(si => {
                    const subName = si.stock ? (si.stock.name || 'មិនស្គាល់') : 'មិនស្គាល់';
                    const proportion = totalStandardValue > 0 ? (si.standardValue / totalStandardValue) : (1 / subItemsData.length);
                    const distributedUsd = itemTotalUsd * proportion;
                    let subQty = si.subItemQty * prodQty;
                    let unitPrice = subQty > 0 ? (distributedUsd / subQty) : 0;

                    const key = `${subName}_${unitPrice.toFixed(4)}`;
                    if(!productSummary[key]) productSummary[key] = { name: subName, qty: 0, usd: 0, unitPrice: unitPrice };
                    productSummary[key].qty += subQty;
                    productSummary[key].usd += distributedUsd;
                });
                return; 
            }
        }

        let isCase = String(prod.unit).toLowerCase() === 'case' || String(prod.unit) === 'កេះ';
        let itemsPerCase = 1;
        if (allStocks) {
            const stockRef = allStocks.find(s => s.id === prod.id || s.name === prod.name);
            if (stockRef) itemsPerCase = Number(stockRef.itemsPerCase) || 1;
        }
        if (prod.itemsPerCase) itemsPerCase = Number(prod.itemsPerCase);
        
        let calculatedQty = isCase ? (prodQty * itemsPerCase) : prodQty;
        let unitPrice = calculatedQty > 0 ? (itemTotalUsd / calculatedQty) : 0;
        
        const key = `${pName}_${unitPrice.toFixed(4)}`;
        if(!productSummary[key]) productSummary[key] = { name: pName, qty: 0, usd: 0, unitPrice: unitPrice };
        productSummary[key].qty += calculatedQty;
        productSummary[key].usd += itemTotalUsd;
    });

    return Object.values(productSummary).sort((a, b) => {
        if (a.name === b.name) return b.unitPrice - a.unitPrice; 
        return a.name.localeCompare(b.name); 
    });
}

// ==========================================
// 🌟 3. គូរតារាងវិក្កយបត្រ (Row Template) 🌟
// ==========================================
const renderSellerRowHTML = (item, data, allCombos, allStocks) => {
    let salesHTML = item.hasSales ? `<div style="text-align: center; color:#334155; font-size:14px; font-weight:bold;">-</div>` : `<span style="color:#94a3b8;">-</span>`;
    let revenueHTML = item.hasSales ? `<div style="text-align:right;"><span style="color:#059669; font-size:15px; font-weight:900; display:block;">${fC(item.revenueUSD)} $</span><span style="color:#2563eb; font-size:12px; font-weight:bold; display:block; margin-top:2px;">${fC(item.revenueKHR)} ៛</span></div>` : `<div style="text-align:right; color:#94a3b8;">-</div>`;
    let catBadge = item.category === "បោះដុំ" ? `<span style="color:#7e22ce; font-weight:900; font-size:11px; background: #f3e8ff; padding: 2px 6px; border-radius: 4px;">បោះដុំ</span>` : item.category === "លក់រាយ" ? `<span style="color:#475569; font-weight:bold; font-size:11px; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">លក់រាយ</span>` : item.hasSales ? `<span style="color:#0ea5e9; font-weight:bold; font-size:11px; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;">ដុំ + រាយ</span>` : `<span style="color:#94a3b8;">-</span>`;

    let detailProductsHTML = '';
    let hasDetailProducts = false;

    if (item.hasSales) {
        const sortedProducts = getDetailedProductsSummary(item, data, allCombos, allStocks);
        if (sortedProducts.length > 0) {
            hasDetailProducts = true;
            const gridItems = sortedProducts.map(p => `
                <div style="width: calc(50% - 15px); display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px dashed #cbd5e1; padding: 6px 0; margin-bottom: 2px;">
                    <div style="flex: 1; padding-right: 10px; color: #334155; line-height: 1.3; font-size: 12px; font-weight: bold;">
                        • ${p.name}
                    </div>
                    <div style="font-weight: 800; width: 110px; text-align: right; color: #475569; font-size: 12px;">
                        ${fQ(p.qty)} ដប <span style="font-size:10px; color:#94a3b8;">(${fC(p.unitPrice)}$)</span>
                    </div>
                    <div style="font-weight: 900; color: #059669; width: 65px; text-align: right; font-size: 12px;">
                        ${fC(p.usd)} $
                    </div>
                </div>
            `).join('');

            detailProductsHTML = `
                <tr style="background: #f8fafc; break-inside: avoid; page-break-inside: avoid;">
                    <td></td>
                    <td colspan="5" style="padding: 0 15px 15px 15px;">
                        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 15px; background: white;">
                            <div style="font-size: 11px; color: #64748b; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">បញ្ជីទំនិញលម្អិត (គិតជាដប)</div>
                            <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                                ${gridItems}
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    const mainRowBorder = hasDetailProducts ? 'none' : '1px solid #cbd5e1';

    return `
      <tbody style="page-break-inside: avoid; break-inside: avoid; border-bottom: 2px solid #cbd5e1;">
          <tr style="border-bottom: ${mainRowBorder}; ${!item.hasSales ? "background-color: #f8fafc;" : ""}">
              <td style="padding: 12px 8px; text-align: center; font-weight: 900; color: #64748b; font-size: 12px;">${item.printIndex}</td>
              <td style="padding: 12px 8px; width: 40%;">
                  <p style="font-weight:900; color:#1e293b; font-size:14px; margin:0;">${item.fullName || item.name || 'មិនស្គាល់'}</p>
                  <p style="color:#64748b; font-size:10px; margin:2px 0 0 0;">ID: ${item.idNumber || item.id || "N/A"}</p>
              </td>
              <td style="padding: 12px 8px; text-align: center; width: 10%;">${catBadge}</td>
              <td style="padding: 12px 8px; width: 10%;">${salesHTML}</td>
              <td style="padding: 12px 8px; text-align: center; font-weight: bold; color: #334155; font-size: 13px; width: 10%;">${item.hasSales ? item.totalClients.toLocaleString() + " នាក់" : "-"}</td>
              <td style="padding: 12px 8px; width: 20%;">${revenueHTML}</td>
          </tr>
          ${detailProductsHTML}
      </tbody>`;
};

// ==========================================
// 🌟 4. មុខងារគូរ HTML ទំព័រសរុប
// ==========================================
const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
    return chunks;
};

const buildChunkTable = (items, data) => {
    if (!items || items.length === 0) return `<div style="font-size:11px; color:#94a3b8; padding: 10px 0; text-align:center;">- មិនមានទិន្នន័យ -</div>`;
    let rows = items.map(i => {
        const unitLabel = i.isCombo ? 'ឈុត' : translateUnit(i.unit, data.availableUnits);
        return `<tr style="border-bottom: 1px dashed #e2e8f0;">
            <td style="padding: 6px 4px; font-weight: bold; color: #334155; width: 60%;">${i.name}</td>
            <td style="padding: 6px 4px; text-align: center; color: #475569; width: 15%;">${fQ(i.qty)} ${unitLabel}</td>
            <td style="padding: 6px 4px; text-align: right; font-weight: bold; color: #0f172a; width: 25%;">${fC(i.total)} $</td>
        </tr>`;
    }).join('');
    return `<table style="width: 100%; border-collapse: collapse; font-size: 11px;"><thead style="background: #f8fafc; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; color: #64748b;"><tr><th style="padding: 6px 4px; text-align: left;">ឈ្មោះទំនិញសរុប</th><th style="padding: 6px 4px; text-align: center;">ចំនួន</th><th style="padding: 6px 4px; text-align: right;">សរុបទឹកប្រាក់</th></tr></thead><tbody>${rows}</tbody></table>`;
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
                <span><strong style="color: #fff; font-size:13px;">${fC(totalWholesaleUSD)} $</strong> <span style="color:#94a3b8; font-size:10px;">(សរុប ${fQ(totalWholesaleClients)} នាក់)</span></span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px;">
                <span style="color:#cbd5e1;">• លក់រាយ (តម្លៃទំនិញសុទ្ធ):</span>
                <span><strong style="color: #fff; font-size:13px;">${fC(totalRetailUSD)} $</strong> <span style="color:#94a3b8; font-size:10px;">(សរុប ${fQ(totalRetailClients)} នាក់)</span></span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 10px; border-top: 1px dashed #475569; font-size: 14px;">
                <span style="font-weight: 900; color: #fdba74;">🛵 ថ្លៃដឹកជញ្ជូនសរុប:</span>
                <span style="font-weight: 900; color: #fdba74; font-size: 16px;">${fC(dataObj.deliveryUSD)} $</span>
            </div>
        </div>
    `;
};

const generateSummaryPagesHTML = (data, isNativePrint = false) => {
    const rData = data.regionalReportSummary;
    let pages = []; let currentBlocks = [];

    const flushPage = () => {
        if (currentBlocks.length === 0) return;
        const footerHTML = `<div style="margin-top: auto; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 10px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; background: white; width: 100%;"><div><span style="background-color: #f8fafc; padding: 4px 10px; border-radius: 4px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 11px; font-weight: 900;">កាលបរិច្ឆេទ: ${data.reportDateLabel}</span></div><div>របាយការណ៍តំបន់លម្អិត</div></div>`;
        const pageStyles = isNativePrint ? `width: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; min-height: 100vh; break-after: page; page-break-after: always; padding: 10mm; font-family: 'Battambang', sans-serif; line-height: 1.6;` : `width: 794px; height: 1123px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; font-family: 'Battambang', sans-serif; line-height: 1.6; position: relative;`;
        pages.push(`<div class="print-page summary-page" style="${pageStyles}"><div style="flex-grow: 1;">${currentBlocks.join('')}</div>${footerHTML}</div>`);
        currentBlocks = [];
    };

    const buildRegionHeader = (title, icon, color) => `<div style="background: ${color}; color: white; padding: 12px 20px; font-weight: 900; font-size: 16px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;"><span>${icon} ${title}</span></div>`;

    const measureDiv = document.createElement('div');
    measureDiv.style.width = '714px'; measureDiv.style.fontFamily = "'Battambang', sans-serif"; measureDiv.style.position = 'absolute'; measureDiv.style.visibility = 'hidden'; measureDiv.style.top = '-9999px';
    document.body.appendChild(measureDiv);

    const processRegion = (title, icon, color, regionData, totalLabel) => {
        let isFirstInRegion = true; let blocksToAdd = [];

        const addStatusBlocks = (statusTitle, statusIcon, statusColor, sData) => {
            if (!sData || (sData.wholesaleUSD === 0 && sData.retailUSD === 0)) return;

            const groupedWholesale = groupItemsByName(sData.wholesaleItems || []);
            const groupedRetail = groupItemsByName(sData.retailItems || []);

            const wsChunks = chunkArray(groupedWholesale, 16);
            const rtChunks = chunkArray(groupedRetail, 16);
            const totalChunks = Math.max(wsChunks.length, rtChunks.length, 1);

            for (let i = 0; i < totalChunks; i++) {
                let wsHtml = ''; let rtHtml = '';
                if (i === 0) wsHtml += `<div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; background: #f1f5f9; padding: 6px 10px; border-radius: 4px; margin-bottom: 5px; color: #7e22ce;"><span>លក់បោះដុំ</span><span>${fC(sData.wholesaleUSD)} $ <span style="font-size:11px; font-weight:normal; color:#64748b;">(${sData.wholesaleClients} នាក់)</span></span></div>`;
                wsHtml += buildChunkTable(wsChunks[i], data);

                if (i === 0) rtHtml += `<div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; background: #f1f5f9; padding: 6px 10px; border-radius: 4px; margin-bottom: 5px; color: #475569;"><span>លក់រាយ</span><span>${fC(sData.retailUSD)} $ <span style="font-size:11px; font-weight:normal; color:#64748b;">(${sData.retailClients} នាក់)</span></span></div>`;
                rtHtml += buildChunkTable(rtChunks[i], data);

                let titleHtml = (i === 0) ? `<h4 style="margin: 0 0 10px 0; color: ${statusColor}; font-size: 14px; font-weight: 900; border-bottom: 2px solid ${statusColor}40; padding-bottom: 6px;">${statusIcon} ${statusTitle}</h4>` : '';
                blocksToAdd.push(`<div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 15px;">${titleHtml}<div style="display: flex; gap: 15px;"><div style="flex: 1; min-width: 0;">${wsHtml}</div><div style="width: 1px; background: #e2e8f0;"></div><div style="flex: 1; min-width: 0;">${rtHtml}</div></div></div>`);
            }
        };

        addStatusBlocks("ទំនិញបានទូទាត់រួច", "✔️", "#059669", regionData.paid);
        addStatusBlocks("ទំនិញមិនទាន់បានទូទាត់", "⏳", "#dc2626", regionData.pending);
        if (regionData.direct) addStatusBlocks("ទំនិញមកទិញផ្ទាល់", "🏬", "#0284c7", regionData.direct);
        blocksToAdd.push(buildTotalBlock(regionData, totalLabel));

        blocksToAdd.forEach((block) => {
            if (isFirstInRegion) { currentBlocks.push(buildRegionHeader(title, icon, color)); isFirstInRegion = false; }
            measureDiv.innerHTML = currentBlocks.join('') + block;
            if (measureDiv.clientHeight > 900) { flushPage(); currentBlocks.push(buildRegionHeader(title, icon, color)); }
            currentBlocks.push(block);
        });
    };

    if (pages.length === 0) currentBlocks.push(`<div style="text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 20px;"><h3 style="font-size: 20px; font-weight: 900; color: #1e293b; margin: 0;">របាយការណ៍លម្អិតតាមតំបន់</h3></div>`);
    processRegion("តំបន់ទិន្នន័យរួម (ភ្នំពេញ + ខេត្ត)", "📊", "#475569", rData.overall, "បូកសរុប ទំនិញបានទូទាត់រួច និង មិនទាន់បានទូទាត់");
    processRegion("តំបន់ទិន្នន័យ: រាជធានីភ្នំពេញ", "📍", "#0284c7", rData.phnomPenh, "បូកសរុប (ទូទាត់រួច + មិនទាន់ទូទាត់ + ទិញផ្ទាល់)");
    processRegion("តំបន់ទិន្នន័យ: តាមបណ្ដាលខេត្ត", "📍", "#d97706", rData.provinces, "បូកសរុប (ទូទាត់រួច + មិនទាន់ទូទាត់)");

    flushPage(); document.body.removeChild(measureDiv);
    return pages;
};

// ==========================================
// 🌟 5. Execution (PDF & Native Print) 🌟
// ==========================================
export const executeNativePrint = async (data) => {
  const { allCombos, allStocks } = await fetchCombosAndStocks();
  const dataWithIndex = data.filteredSellers.map((item, idx) => ({ ...item, printIndex: idx + 1 }));

  const allRowsHtml = dataWithIndex.map(r => renderSellerRowHTML(r, data, allCombos, allStocks)).join('');

  let tableHTML = `
      <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff; margin-bottom: 30px;">
          <thead style="background: #f1f5f9; color: #334155; font-size: 12px; font-weight: 900; display: table-header-group;">
              <tr>
                  <th style="padding: 10px 8px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th>
                  <th style="padding: 10px 8px; width: 40%; border-bottom: 2px solid #cbd5e1;">តំណាងលក់ និងទំនិញលម្អិត</th>
                  <th style="padding: 10px 8px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">ប្រភេទ</th>
                  <th style="padding: 10px 8px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">បរិមាណរួម</th>
                  <th style="padding: 10px 8px; width: 15%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th>
                  <th style="padding: 10px 8px; width: 20%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th>
              </tr>
          </thead>
          ${allRowsHtml}
      </table>
  `;

  const mainTitle = `<div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #4f46e5;"><h1 style="font-size: 22px; font-weight: 900; color: #4338ca; margin: 0;">របាយការណ៍លក់សរុប</h1></div>`;
  const footerHTML = `<div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 10px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between; align-items: center;"><div><span style="background-color: #f8fafc; padding: 4px 10px; border-radius: 4px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 11px; font-weight: 900;">កាលបរិច្ឆេទ: ${data.reportDateLabel}</span></div></div>`;

  const summaryPagesHTML = generateSummaryPagesHTML(data, true).join("");
  const contentHTML = `<div class="print-wrapper" style="width: 100%; box-sizing: border-box; font-family: 'Battambang', sans-serif; line-height: 1.5;">${mainTitle}${tableHTML}${footerHTML}<div style="page-break-before: always; margin-top:40px;"></div>${summaryPagesHTML}</div>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute"; iframe.style.width = "0"; iframe.style.height = "0"; iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
        <html>
        <head>
            <title>Sales_Report_${data.dateFilterType}</title>
            <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 portrait; margin: 10mm; } 
                body { font-family: 'Battambang', sans-serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; background-color: white; } 
                table { width: 100%; border-collapse: collapse; } 
                @media print {
                    tbody { page-break-inside: avoid !important; }
                    tr { page-break-inside: avoid !important; page-break-after: auto !important; }
                    thead { display: table-header-group !important; }
                }
            </style>
        </head>
        <body>${contentHTML}</body>
        </html>
    `);
  doc.close();

  iframe.contentWindow.document.fonts.ready.then(() => {
    setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => { document.body.removeChild(iframe); }, 1000); }, 800);
  });
};

export const generatePDF = async (data, printStagingEl, processingRef) => {
  processingRef.value = { active: true, message: "កំពុងវាស់ទំហំទំព័រ PDF...", progress: 10 };
  try {
    const { allCombos, allStocks } = await fetchCombosAndStocks();
    const pdfWidth = 210; const pdf = new jsPDF("p", "mm", "a4");
    
    let allRows = [...data.filteredSellers].map((item, idx) => ({ ...item, printIndex: idx + 1 }));
    
    const measureDiv = document.createElement('div');
    measureDiv.style.width = '1000px'; 
    measureDiv.style.fontFamily = "'Battambang', sans-serif";
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.top = '-9999px';
    document.body.appendChild(measureDiv);

    let tablePages = [];
    let currentRows = [];
    const MAX_TABLE_HEIGHT = 1150; 

    const wrapTable = (rowsHtml) => `
        <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">
            <thead style="background: #f1f5f9; color: #334155; font-size: 11px; font-weight: 900;">
                <tr>
                    <th style="padding: 10px 8px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th>
                    <th style="padding: 10px 8px; width: 40%; border-bottom: 2px solid #cbd5e1;">តំណាងលក់ និងទំនិញលម្អិត</th>
                    <th style="padding: 10px 8px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">ប្រភេទ</th>
                    <th style="padding: 10px 8px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">បរិមាណរួម</th>
                    <th style="padding: 10px 8px; width: 15%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th>
                    <th style="padding: 10px 8px; width: 20%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th>
                </tr>
            </thead>
            ${rowsHtml}
        </table>
    `;

    for (let i = 0; i < allRows.length; i++) {
        const rowHtml = renderSellerRowHTML(allRows[i], data, allCombos, allStocks);
        measureDiv.innerHTML = wrapTable(currentRows.join('') + rowHtml);

        if (measureDiv.clientHeight > MAX_TABLE_HEIGHT && currentRows.length > 0) {
            tablePages.push(currentRows.join(''));
            currentRows = [rowHtml];
        } else {
            currentRows.push(rowHtml);
        }
    }
    if (currentRows.length > 0) tablePages.push(currentRows.join(''));

    const summaryPagesArr = generateSummaryPagesHTML(data, false);
    const totalPdfPages = tablePages.length + summaryPagesArr.length;

    for (let i = 0; i < tablePages.length; i++) {
        processingRef.value.message = `កំពុងគូរតារាងទំព័រទី ${i + 1}...`;
        
        const mainTitle = i === 0 ? `<div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #4f46e5;"><h1 style="font-size: 22px; font-weight: 900; color: #4338ca; margin: 0;">របាយការណ៍លក់សរុប</h1></div>` : "";
        const footerHTML = `
            <div style="margin-top: auto; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 10px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between; align-items: center;">
                <div><span style="background-color: #f8fafc; padding: 4px 10px; border-radius: 4px; border: 1px solid #e2e8f0; color: #1e293b; font-size: 11px; font-weight: 900;">កាលបរិច្ឆេទ: ${data.reportDateLabel}</span></div>
                <div>ទំព័រទី ${i + 1} នៃ ${totalPdfPages}</div>
            </div>
        `;
        
        printStagingEl.innerHTML = `
            <div class="print-page" style="width: 1000px; height: 1414px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; font-family: 'Battambang', sans-serif; line-height: 1.5; position: relative; overflow: hidden;">
                <div style="flex-grow: 1;">${mainTitle}${wrapTable(tablePages[i])}</div>
                ${footerHTML}
            </div>
        `;

        await nextTick(); await document.fonts.ready; await new Promise((r) => setTimeout(r, 600));
        const canvas = await html2canvas(printStagingEl.querySelector(".print-page"), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        
        if (i > 0) pdf.addPage();
        const imgProps = pdf.getImageProperties(imgData);
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, (imgProps.height * pdfWidth) / imgProps.width);
        processingRef.value.progress = 10 + Math.round(((i + 1) / tablePages.length) * 30);
    }

    processingRef.value.message = `កំពុងគូររបាយការណ៍តំបន់លម្អិត...`;
    
    for (let i = 0; i < summaryPagesArr.length; i++) {
        printStagingEl.innerHTML = summaryPagesArr[i];
        await new Promise((r) => setTimeout(r, 600)); 

        const canvas = await html2canvas(printStagingEl.querySelector(".print-page"), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        
        pdf.addPage(); 
        const imgProps = pdf.getImageProperties(imgData);
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, (imgProps.height * pdfWidth) / imgProps.width); 
        processingRef.value.progress += Math.round(60 / summaryPagesArr.length);
    }
    
    document.body.removeChild(measureDiv);
    processingRef.value.progress = 100; processingRef.value.message = "កំពុងរក្សាទុកឯកសារ PDF...";
    pdf.save(`Sales_Report_${data.dateFilterType}.pdf`);
    setTimeout(() => { processingRef.value.active = false; }, 800);
  } catch (e) {
    console.error(e); processingRef.value.active = false; alert("មានបញ្ហាក្នុងការទាញយក PDF សូមព្យាយាមម្តងទៀត។");
  }
};

// ==========================================
// 🌟 6. EXCEL GENERATOR (2 Columns Grid) 🌟
// ==========================================
export const generateExcel = async (data, processingRef) => {
    processingRef.value = { active: true, message: 'កំពុងរៀបចំទិន្នន័យ Excel...', progress: 30 };

    try {
        const { allCombos, allStocks } = await fetchCombosAndStocks();
        processingRef.value.progress = 50;

        let mainTableRows = '';
        data.filteredSellers.forEach((item, idx) => {
            const printIndex = idx + 1;
            const hasS = item.hasSales;
            const cStr = hasS ? item.totalClients : '-';
            const rUSD = hasS ? fC(item.revenueUSD) : '-';
            const rKHR = hasS ? fC(item.revenueKHR) : '-';
            
            mainTableRows += `
                <tr>
                    <td style="border: 1px solid #cbd5e1; text-align: center; font-weight: bold; background-color: #f8fafc;">${printIndex}</td>
                    <td colspan="2" style="border: 1px solid #cbd5e1; font-weight: bold; font-size: 14px; background-color: #f8fafc;">${item.fullName || item.name}</td>
                    <td style="border: 1px solid #cbd5e1; text-align: center; background-color: #f8fafc; font-weight: bold;">អតិថិជន: ${cStr}</td>
                    <td style="border: 1px solid #cbd5e1; text-align: right; color:#059669; font-weight:bold; background-color: #f8fafc;">${rUSD} $</td>
                    <td colspan="4" style="border: 1px solid #cbd5e1; text-align: right; color:#2563eb; font-weight:bold; background-color: #f8fafc;">សរុបរៀល: ${rKHR} ៛</td>
                </tr>
            `;

            if (hasS) {
                const sortedProducts = getDetailedProductsSummary(item, data, allCombos, allStocks);
                
                for (let i = 0; i < sortedProducts.length; i += 2) {
                    const p1 = sortedProducts[i];
                    const p2 = sortedProducts[i+1];
                    
                    mainTableRows += `<tr>
                        <td style="border: 1px solid #cbd5e1;"></td>
                        <td colspan="2" style="border: 1px solid #cbd5e1; color: #1e293b; font-weight:bold;">• ${p1.name}</td>
                        <td style="border: 1px solid #cbd5e1; text-align: center; color: #475569; font-weight: bold;">${fQ(p1.qty)} ដប <span style="font-size:11px; color:#94a3b8;">(${fC(p1.unitPrice)}$)</span></td>
                        <td style="border: 1px solid #cbd5e1; text-align: right; color: #0f172a; font-weight: bold;">${fC(p1.usd)} $</td>
                        ${p2 ? `
                            <td colspan="2" style="border: 1px solid #cbd5e1; color: #1e293b; font-weight:bold;">• ${p2.name}</td>
                            <td style="border: 1px solid #cbd5e1; text-align: center; color: #475569; font-weight: bold;">${fQ(p2.qty)} ដប <span style="font-size:11px; color:#94a3b8;">(${fC(p2.unitPrice)}$)</span></td>
                            <td style="border: 1px solid #cbd5e1; text-align: right; color: #0f172a; font-weight: bold;">${fC(p2.usd)} $</td>
                        ` : `<td colspan="4" style="border: 1px solid #cbd5e1;"></td>`}
                    </tr>`;
                }
            }
        });

        const generateSectionRows = (title, sectionData) => {
            let sectionRows = `
                <tr><td colspan="9"></td></tr>
                <tr><th colspan="9" style="background-color: #1e293b; color: white; font-size: 14pt; text-align: left;">${title}</th></tr>
            `;

            sectionRows += `<tr><th colspan="9" style="background-color: #d1fae5; color: #065f46; text-align: left;">✅ ទំនិញបានទូទាត់រួច (PAID)</th></tr>`;
            
            const addProductRows = (catName, catData) => {
                const groupedItems = groupItemsByName(catData.items || []);
                if(groupedItems.length > 0) {
                     sectionRows += `<tr><th colspan="9" style="background-color: #f1f5f9; text-align: left;">${catName} (អតិថិជន: ${fQ(catData.clients)})</th></tr>`;
                     sectionRows += `<tr><th colspan="3">ឈ្មោះទំនិញ</th><th colspan="2">បរិមាណ</th><th colspan="4">ចំណូលសរុប (USD)</th></tr>`;
                     groupedItems.forEach(p => {
                         const unitLabel = p.isCombo ? 'ឈុត' : translateUnit(p.unit, data.availableUnits);
                         sectionRows += `<tr>
                            <td colspan="3" style="border: 1px solid #cbd5e1;">${p.name}</td>
                            <td colspan="2" style="border: 1px solid #cbd5e1; text-align: center;">${fQ(p.qty)} ${unitLabel}</td>
                            <td colspan="4" style="border: 1px solid #cbd5e1; text-align: right; color:#1e293b; font-weight:bold;">${fC(p.total)} $</td>
                         </tr>`;
                     });
                     sectionRows += `<tr><td colspan="5" style="text-align: right; font-weight:bold; background-color:#f8fafc;">សរុប ${catName}:</td><td colspan="4" style="text-align: right; font-weight:bold; background-color:#f8fafc; color:#059669;">${fC(catData.usd)} $</td></tr>`;
                }
            };
            
            addProductRows('លក់បោះដុំ (Wholesale)', { items: sectionData.paid.wholesaleItems, clients: sectionData.paid.wholesaleClients, usd: sectionData.paid.wholesaleUSD });
            addProductRows('លក់រាយ (Retail)', { items: sectionData.paid.retailItems, clients: sectionData.paid.retailClients, usd: sectionData.paid.retailUSD });
            
            sectionRows += `<tr><th colspan="9" style="background-color: #fef3c7; color: #92400e; text-align: left;">⏳ មិនទាន់បានទូទាត់ (PENDING)</th></tr>`;
            addProductRows('លក់បោះដុំ (Wholesale)', { items: sectionData.pending.wholesaleItems, clients: sectionData.pending.wholesaleClients, usd: sectionData.pending.wholesaleUSD });
            addProductRows('លក់រាយ (Retail)', { items: sectionData.pending.retailItems, clients: sectionData.pending.retailClients, usd: sectionData.pending.retailUSD });

            return sectionRows;
        };

        const rData = data.regionalReportSummary;
        const excelHTML = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8">
                <style>
                    table { font-family: 'Battambang', Arial, sans-serif; border-collapse: collapse; }
                    th { border: 1px solid #cbd5e1; padding: 10px; }
                    td { border: 1px solid #cbd5e1; padding: 8px; }
                </style>
            </head>
            <body>
                <table>
                    <tr><th colspan="9" style="font-size:18pt; text-align:center; background-color:#f1f5f9; height:40px;">របាយការណ៍លក់សរុប</th></tr>
                    <tr><th colspan="9" style="font-size:12pt; text-align:center; background-color:#f1f5f9; font-weight:normal;">កាលបរិច្ឆេទ: ${data.reportDateLabel}</th></tr>
                    <tr><td colspan="9"></td></tr>
                    
                    <tr><th colspan="9" style="background-color: #1e293b; color: white; font-size: 12pt; text-align: left;">បញ្ជីតំណាងលក់ និងទំនិញលម្អិត</th></tr>
                    <tr style="background-color: #f8fafc;">
                        <th>#</th>
                        <th colspan="2">តំណាងលក់ / ទំនិញទី១</th>
                        <th>បរិមាណទី១</th>
                        <th>ចំណូលទី១ (USD)</th>
                        <th colspan="2">ទំនិញទី២</th>
                        <th>បរិមាណទី២</th>
                        <th>ចំណូលទី២ (USD)</th>
                    </tr>
                    ${mainTableRows}

                    ${generateSectionRows('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', rData.overall)}
                    ${generateSectionRows('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', rData.phnomPenh)}
                    ${generateSectionRows('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', rData.provinces)}
                </table>
            </body>
            </html>
        `;

        processingRef.value.progress = 100;
        processingRef.value.message = 'រួចរាល់!';

        const blob = new Blob(['\ufeff', excelHTML], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sales_Report_${data.dateFilterType}_${new Date().getTime()}.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
    } catch(e) {
        console.error(e);
        alert("មានបញ្ហាក្នុងការទាញយក Excel");
    } finally {
        setTimeout(() => { processingRef.value.active = false; }, 500);
    }
};