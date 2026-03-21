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
// 🌟 2. មុខងារទាញយកទំនិញលម្អិត (បំបែកដប & ត្រង CANCELED)
// ==========================================
export function getDetailedProductsSummary(item, data, allCombos, allStocks) {
    let productsToProcess = [];
    if (data.allSales && data.allSales.length > 0) {
        const targetId = item.originalSellerId || item.id || item.originalAdminId;
        const validSales = data.allSales.filter(s => 
            (s.createdBy === targetId || s.uid === targetId) && 
            s.paymentStatus !== 'CANCELED' && s.paymentStatus !== 'Canceled'
        );
        validSales.forEach(sale => {
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
        let priceUsd = Number(prod.price || prod.unitPrice || prod.retailPrice || 0);
        if (prod.saleCurrency === 'KHR' || prod.saleCurrency === '៛' || prod.currency === 'KHR') priceUsd /= 4000;
        let itemTotalUsd = Number(prod.total || prod.totalAmount || prod.amount || prod.usd || 0);
        let prodQty = Number(prod.qty || 1);
        if (itemTotalUsd === 0 && priceUsd > 0) itemTotalUsd = priceUsd * prodQty;
        if (priceUsd === 0 && itemTotalUsd > 0) priceUsd = itemTotalUsd / prodQty;
        let curr = String(prod.currency || prod.saleCurrency || '').toUpperCase();
        if (curr === 'KHR' || curr === '៛' || String(prod.price).includes('៛')) { priceUsd /= 4000; itemTotalUsd /= 4000; }

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

        const pName = prod.name || 'មិនស្គាល់'; 
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

const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
    return chunks;
};

// ==========================================
// 🌟 3. គូរតារាងវិក្កយបត្រ (Row Template) 
// ==========================================
// ✅ កែឈ្មោះ Function ឱ្យត្រូវ ១០០%
const renderOwnerRowHTML = (item, data, allCombos, allStocks, unitSettings) => {
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
                <div style="width: calc(50% - 10px); display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px dashed #cbd5e1; padding: 6px 0; margin-bottom: 2px; break-inside: avoid; page-break-inside: avoid;">
                    <div style="flex: 1; padding-right: 10px; color: #334155; line-height: 1.3; font-size: 12px; font-weight: bold;">
                        • ${p.name}
                    </div>
                    <div style="font-weight: 800; width: 100px; text-align: right; color: #475569; font-size: 12px;">
                        ${fQ(p.qty)} ដប <span style="font-size:10px; color:#94a3b8;">(${fC(p.unitPrice)}$)</span>
                    </div>
                    <div style="font-weight: 900; color: #059669; width: 65px; text-align: right; font-size: 12px;">
                        ${fC(p.usd)} $
                    </div>
                </div>
            `).join('');

            detailProductsHTML = `
                <tr style="background: #f8fafc;">
                    <td></td>
                    <td colspan="5" style="padding: 0 15px 15px 15px;">
                        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 15px; background: white;">
                            <div style="font-size: 11px; color: #64748b; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">បញ្ជីទំនិញលម្អិត (គិតជាដប)</div>
                            <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                                ${gridItems}
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    const mainRowBorder = hasDetailProducts ? 'none' : '1px solid #cbd5e1';

    // 🚨 ដក page-break-inside: avoid ចេញពី tbody ដើម្បីកុំឱ្យ Print ចេញក្រដាសស 🚨
    return `
      <tbody style="border-bottom: 2px solid #cbd5e1;">
          <tr style="border-bottom: ${mainRowBorder}; ${!item.hasSales ? "background-color: #f8fafc;" : ""}; break-inside: avoid; page-break-inside: avoid;">
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
const renderProductGridFlex = (productsArray, unitSettings) => {
    const cards = productsArray.map((p, index) => {
        const unitPrice = p.qty > 0 ? (p.usd / p.qty) : 0;
        return `
        <div style="width: calc(50% - 8px); border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; background: #fff; box-sizing: border-box; break-inside: avoid; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <span style="font-weight: 700; color: #1e293b; font-size: 12px; line-height: 1.4; padding-right: 10px; flex: 1;">📦 ${p.name}</span>
                <span style="font-weight: 900; color: #0f172a; font-size: 13px;">${fC(p.usd)} $</span>
            </div>
            <div style="font-size: 11px; color: #475569; display: flex; justify-content: space-between; border-top: 1px dashed #e2e8f0; padding-top: 6px;">
                <span>អតិថិជន: <span style="font-weight:700; color:#334155;">${fQ(p.clients)}</span> នាក់</span>
                <span>បរិមាណ: <span style="font-weight:900; color:#0ea5e9; font-size:12px;">${fQ(p.qty)} ${translateUnit(p.unit, unitSettings)}</span> <span style="color:#94a3b8; font-weight:bold;">(${fC(unitPrice)}$)</span></span>
            </div>
        </div>`;
    }).join('');
    return `<div style="display: flex; flex-wrap: wrap; gap: 12px; width: 100%;">${cards}</div>`;
};

const buildRegionBlocks = (title, data, isGrandTotal = false, expensesList = [], unitSettings = []) => {
    let blocks = [];
    
    blocks.push(`
        <div style="background: #1e293b; color: white; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 12px 12px 0 0; margin-top: 20px; break-inside: avoid; page-break-inside: avoid;">
            <span style="font-size: 16px; font-weight: 900;">${title}</span>
            <span style="font-size: 13px; font-weight: bold; background: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 20px;">អតិថិជនសរុប: ${fQ(data.totalClients)} នាក់</span>
        </div>
    `);

    const addProductBlocks = (statusTitle, statusEmoji, catName, products, accentColor, totalItemPrice) => {
        if (!products || products.length === 0) return;
        const chunks = chunkArray(products, 14); 
        chunks.forEach((chunk, index) => {
            let html = `<div style="background: white; padding: 20px; border-left: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; ${index === chunks.length - 1 ? 'border-bottom: 1px dashed #cbd5e1;' : ''}">`;
            if (index === 0) {
                const statusColor = statusEmoji === '✅' ? '#059669' : '#d97706';
                html += `<h4 style="color: ${statusColor}; margin: 0 0 15px 0; font-size: 16px; font-weight: 900;">${statusEmoji} ${statusTitle}</h4>`;
            }
            html += `<div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #f1f5f9;">`;
            if (index === 0) {
                html += `
                <div style="display: flex; justify-content: space-between; align-items: center; border-left: 4px solid ${accentColor}; padding: 0 0 0 10px; margin-bottom: 12px;">
                    <span style="font-weight: 900; color: ${accentColor}; font-size: 14px;">${catName}</span>
                    <span style="font-weight: 900; color: #0f172a; font-size: 13px;">សរុបតម្លៃទំនិញសុទ្ធ: <span style="color: ${accentColor};">${fC(totalItemPrice)} $</span></span>
                </div>`;
            } else {
                html += `<div style="margin-bottom: 12px; font-weight: bold; color: #64748b; font-size: 12px;">${catName} (បន្ត)</div>`;
            }
            html += renderProductGridFlex(chunk, unitSettings);
            html += `</div></div>`;
            blocks.push(html);
        });
    };

    addProductBlocks('ទំនិញបានទូទាត់រួច (PAID)', '✅', '📦 លក់បោះដុំ (WHOLESALE)', data.paid.wholesale.products, '#7e22ce', data.paid.wholesale.itemPriceTotalUSD);
    addProductBlocks('ទំនិញបានទូទាត់រួច (PAID)', '✅', '🛍️ លក់រាយ (RETAIL)', data.paid.retail.products, '#0ea5e9', data.paid.retail.itemPriceTotalUSD);
    
    blocks.push(`
        <div style="background: white; padding: 10px 20px 20px 20px; border-left: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; border-bottom: 2px solid #e2e8f0; break-inside: avoid; page-break-inside: avoid;">
            <div style="text-align: right; font-size: 13px; color: #475569; background: #ecfdf5; padding: 10px 16px; border-radius: 8px; display: inline-block; float: right; border: 1px solid #a7f3d0;">
                ថ្លៃដឹកជញ្ជូនសរុប (Delivery Paid): <span style="color: #059669; font-weight: 900; margin-left: 8px; font-size: 14px;">${fC(data.summary.paidDeliveryTotal)} $</span>
            </div>
            <div style="clear: both;"></div>
        </div>
    `);

    addProductBlocks('មិនទាន់បានទូទាត់ (PENDING)', '⏳', '📦 លក់បោះដុំ (WHOLESALE)', data.unpaid.wholesale.products, '#b45309', data.unpaid.wholesale.itemPriceTotalUSD);
    addProductBlocks('មិនទាន់បានទូទាត់ (PENDING)', '⏳', '🛍️ លក់រាយ (RETAIL)', data.unpaid.retail.products, '#ea580c', data.unpaid.retail.itemPriceTotalUSD);

    blocks.push(`
        <div style="background: white; padding: 10px 20px 20px 20px; border-left: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; border-bottom: 2px solid #e2e8f0; break-inside: avoid; page-break-inside: avoid;">
            <div style="text-align: right; font-size: 13px; color: #92400e; background: #fef3c7; padding: 10px 16px; border-radius: 8px; display: inline-block; float: right; border: 1px solid #fde68a;">
                ថ្លៃដឹកជញ្ជូនសរុប (Delivery Pending): <span style="color: #d97706; font-weight: 900; margin-left: 8px; font-size: 14px;">${fC(data.summary.unpaidDeliveryTotal)} $</span>
            </div>
            <div style="clear: both;"></div>
        </div>
    `);

    if (isGrandTotal && expensesList.length > 0) {
        const expRows = expensesList.map((exp, idx) => {
            let expUSD = Number(exp.amount || 0);
            if (exp.currency === 'KHR') expUSD = expUSD / 4000;
            return `<tr style="break-inside: avoid; page-break-inside: avoid;"><td style="padding: 8px 10px; border-bottom: 1px solid #fecdd3; font-weight: bold; color: #881337;">${idx + 1}. ${exp.reason}</td><td style="padding: 8px 10px; border-bottom: 1px solid #fecdd3; text-align: center; color: #9f1239;">${exp.requester}</td><td style="padding: 8px 10px; border-bottom: 1px solid #fecdd3; text-align: right; font-weight: 900; color: #be123c;">${fC(expUSD)} $</td></tr>`;
        }).join('');
        blocks.push(`
            <div style="background: #fff1f2; padding: 20px; border-left: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; border-bottom: 2px solid #e2e8f0; break-inside: avoid; page-break-inside: avoid;">
                <h4 style="color: #be123c; margin: 0 0 12px 0; font-size: 16px; font-weight: 900;">💸 ការចំណាយទូទៅ (EXPENSES)</h4>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead><tr style="border-bottom: 2px solid #fecdd3;"><th style="padding: 10px; text-align: left; color: #9f1239;">បរិយាយការចំណាយ</th><th style="padding: 10px; text-align: center; color: #9f1239;">អ្នកស្នើ</th><th style="padding: 10px; text-align: right; color: #9f1239;">តម្លៃ (USD)</th></tr></thead>
                    <tbody>${expRows}</tbody>
                </table>
            </div>
        `);
    }

    const profitColor = data.summary.netProfit >= 0 ? '#059669' : '#e11d48';
    if (isGrandTotal) {
        blocks.push(`
            <div style="background: #f8fafc; padding: 25px 30px; display: flex; flex-direction: column; align-items: flex-end; border-left: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; border-radius: 0 0 12px 12px; break-inside: avoid; page-break-inside: avoid;">
                <div style="width: 480px; font-size: 13px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #334155;"><span>ចំណូលសរុប (ទំនិញ PAID):</span><span style="font-weight: 700;">${fC(data.summary.paidItemsTotal)} $</span></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #334155;"><span>ចំណូលសរុប (ថ្លៃដឹក PAID):</span><span style="font-weight: 700;">${fC(data.summary.paidDeliveryTotal)} $</span></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #059669; font-weight: bold; border-bottom: 1px dashed #cbd5e1; padding-bottom: 12px;"><span>ចំណូលសរុប (ទំនិញ + ថ្លៃដឹក):</span><span style="font-size: 15px; font-weight: 900;">${fC(data.summary.paidTotal)} $</span></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #d97706; font-weight: bold;"><span>មិនទាន់ទូទាត់សរុប (ទំនិញ+ថ្លៃដឹក PENDING):</span><span style="font-size: 14px; font-weight: 900;">- ${fC(data.summary.unpaidTotal)} $</span></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #be123c; font-weight: bold;"><span>ចំណាយសរុប (Expenses):</span><span style="font-size: 14px; font-weight: 900;">- ${fC(data.summary.totalExpensesUSD)} $</span></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px; color: #64748b; font-weight: bold; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px;"><span>សរុបតម្លៃដើម (Total Cost of Goods Sold):</span><span style="font-size: 14px; font-weight: 900; color: #475569;">- ${fC(data.summary.totalPaidCostUSD)} $</span></div>
                    <div style="display: flex; justify-content: space-between; align-items: center; color: #0f172a;"><span style="font-weight: 900; text-transform: uppercase;">ប្រាក់ចំណេញសុទ្ធ (NET PROFIT):</span><span style="font-size: 20px; font-weight: 900; background: #e2e8f0; padding: 4px 12px; border-radius: 8px; color: ${profitColor};">${fC(data.summary.netProfit)} $</span></div>
                </div>
            </div>
        `);
    } else {
        blocks.push(`
            <div style="background: #f8fafc; padding: 20px; display: flex; flex-direction: column; align-items: flex-end; border-left: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; border-radius: 0 0 12px 12px; break-inside: avoid; page-break-inside: avoid;">
                <div style="width: 350px; font-size: 13px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #334155;"><span>ចំណូលទំនិញ (PAID):</span><span style="font-weight: 700;">${fC(data.summary.paidItemsTotal)} $</span></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #334155;"><span>ចំណូលថ្លៃដឹក (PAID):</span><span style="font-weight: 700;">${fC(data.summary.paidDeliveryTotal)} $</span></div>
                    <div style="display: flex; justify-content: space-between; margin-top: 6px; color: #059669; font-weight: bold; border-top: 1px dashed #cbd5e1; padding-top: 6px;"><span>ចំណូលសរុប (ទូទាត់រួច):</span><span style="font-size: 15px; font-weight: 900;">${fC(data.summary.paidTotal)} $</span></div>
                    <div style="display: flex; justify-content: space-between; margin-top: 6px; color: #64748b; font-weight: bold; border-top: 1px dashed #cbd5e1; padding-top: 6px;"><span>តម្លៃដើមសរុប (Cost of Goods Sold):</span><span style="font-size: 14px; font-weight: 900;">${fC(data.summary.totalPaidCostUSD)} $</span></div>
                </div>
            </div>
        `);
    }
    
    return blocks;
};

// ==========================================
// 🌟 5. Execution (PDF & Native Print) 🌟
// ==========================================
export const executeNativePrint = async (rowsToPrint, allSales, advancedPrintStats, reportDateLabel, reportAdminLabel, unitSettings) => {
    const { allCombos, allStocks } = await fetchCombosAndStocks();
    const stats = advancedPrintStats;

    const allRowsHtml = rowsToPrint.map(r => renderOwnerRowHTML(r, { allSales }, allCombos, allStocks, unitSettings)).join('');

    const tableHTML = `
        <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff; margin-bottom: 30px;">
            <thead style="background: #f1f5f9; color: #334155; font-size: 12px; font-weight: 900; display: table-header-group;">
                <tr>
                    <th style="padding: 10px 8px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th>
                    <th style="padding: 10px 8px; width: 40%; border-bottom: 2px solid #cbd5e1;">អ្នកគ្រប់គ្រង និងទំនិញលម្អិត</th>
                    <th style="padding: 10px 8px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">ប្រភេទ</th>
                    <th style="padding: 10px 8px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">បរិមាណរួម</th>
                    <th style="padding: 10px 8px; width: 15%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th>
                    <th style="padding: 10px 8px; width: 20%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th>
                </tr>
            </thead>
            ${allRowsHtml}
        </table>
    `;

    const summaryHTML = 
        buildRegionBlocks('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', stats.grand, true, stats.expensesList, unitSettings).join('') +
        buildRegionBlocks('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', stats.pp, false, [], unitSettings).join('') +
        buildRegionBlocks('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', stats.prov, false, [], unitSettings).join('');

    const mainTitle = `<div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #4f46e5;"><h1 style="font-size: 22px; font-weight: 900; color: #4338ca; margin: 0;">របាយការណ៍គណនេយ្យលម្អិត</h1><p style="font-size: 13px; color: #64748b; margin: 6px 0 0 0; font-weight: bold;">កាលបរិច្ឆេទ: <span style="color: #334155; font-weight: 900;">${reportDateLabel}</span> &nbsp;|&nbsp; សម្រាប់: <span style="color: #334155; font-weight: 900;">${reportAdminLabel}</span></p></div>`;

    const contentHTML = `
        <div class="print-wrapper" style="width: 100%; box-sizing: border-box; font-family: 'Battambang', 'Kantumruy Pro', sans-serif; line-height: 1.5;">
            ${mainTitle}
            ${tableHTML}
            <div style="page-break-before: always; margin-top:40px;"></div>
            <div style="text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 20px;">
                <h3 style="font-size: 20px; font-weight: 900; color: #1e293b; margin: 0;">របាយការណ៍លម្អិតតាមតំបន់</h3>
            </div>
            ${summaryHTML}
        </div>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute"; iframe.style.width = "0"; iframe.style.height = "0"; iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    // 🚨 ទុកឱ្យ Browser ជាអ្នកកាត់ទំព័រដោយស្វ័យប្រវត្តិ (កុំបង្ខំ break-inside លើ Tbody) 🚨
    doc.write(`
        <html>
        <head>
            <title>Accounting_Report</title>
            <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 portrait; margin: 10mm; } 
                body { font-family: 'Kantumruy Pro', 'Battambang', sans-serif; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; background-color: white; } 
                table { width: 100%; border-collapse: collapse; } 
                .avoid-break { page-break-inside: avoid !important; break-inside: avoid !important; }
                @media print {
                    /* បណ្តោយឱ្យ tbody កាត់ទំព័រតាមធម្មជាតិ ដើម្បីការពារចេញក្រដាសស */
                    tbody, div { page-break-inside: auto !important; break-inside: auto !important; }
                    /* កុំឱ្យដាច់ពាក់កណ្តាលជួរ (tr) */
                    tr { page-break-inside: avoid !important; break-inside: avoid !important; page-break-after: auto !important; }
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

export const generatePDF = async (rowsToPrint, allSales, advancedPrintStats, reportDateLabel, reportAdminLabel, adminName, unitSettings, processingState, printStagingRef) => {
    processingState.active = true; processingState.message = 'កំពុងវាស់ទំហំទំព័រ PDF...'; processingState.progress = 10;
    
    try {
        const { allCombos, allStocks } = await fetchCombosAndStocks();
        const stats = advancedPrintStats;
        const pdfWidth = 210; const pdf = new jsPDF('p', 'mm', 'a4'); 
        
        const measureDiv = document.createElement('div');
        measureDiv.style.width = '1000px'; 
        measureDiv.style.fontFamily = "'Battambang', 'Kantumruy Pro', sans-serif";
        measureDiv.style.position = 'absolute'; measureDiv.style.visibility = 'hidden'; measureDiv.style.top = '-9999px';
        document.body.appendChild(measureDiv);

        let tablePages = []; let currentRows = [];
        const MAX_TABLE_HEIGHT = 1150; 

        const wrapTable = (rowsHtml) => `
            <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">
                <thead style="background: #f1f5f9; color: #334155; font-size: 11px; font-weight: 900;">
                    <tr>
                        <th style="padding: 10px 8px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">#</th>
                        <th style="padding: 10px 8px; width: 40%; border-bottom: 2px solid #cbd5e1;">អ្នកគ្រប់គ្រង និងទំនិញលម្អិត</th>
                        <th style="padding: 10px 8px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">ប្រភេទ</th>
                        <th style="padding: 10px 8px; width: 10%; text-align: center; border-bottom: 2px solid #cbd5e1;">បរិមាណរួម</th>
                        <th style="padding: 10px 8px; width: 15%; text-align: center; border-bottom: 2px solid #cbd5e1;">អតិថិជន</th>
                        <th style="padding: 10px 8px; width: 20%; text-align: right; border-bottom: 2px solid #cbd5e1;">ចំណូល</th>
                    </tr>
                </thead>
                ${rowsHtml}
            </table>
        `;

        for (let i = 0; i < rowsToPrint.length; i++) {
            const rowHtml = renderOwnerRowHTML(rowsToPrint[i], { allSales }, allCombos, allStocks, unitSettings);
            measureDiv.innerHTML = wrapTable(currentRows.join('') + rowHtml);

            if (measureDiv.clientHeight > MAX_TABLE_HEIGHT && currentRows.length > 0) {
                tablePages.push(currentRows.join('')); currentRows = [rowHtml];
            } else {
                currentRows.push(rowHtml);
            }
        }
        if (currentRows.length > 0) tablePages.push(currentRows.join(''));

        const allSummaryBlocks = [
            `<div style="text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 20px;"><h3 style="font-size: 20px; font-weight: 900; color: #1e293b; margin: 0;">របាយការណ៍លម្អិតតាមតំបន់</h3></div>`,
            ...buildRegionBlocks('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', stats.grand, true, stats.expensesList, unitSettings),
            ...buildRegionBlocks('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', stats.pp, false, [], unitSettings),
            ...buildRegionBlocks('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', stats.prov, false, [], unitSettings)
        ];

        let summaryPages = []; let currSummary = [];
        const MAX_SUMMARY_HEIGHT = 1150; 

        allSummaryBlocks.forEach(block => {
            measureDiv.innerHTML = currSummary.join('') + block;
            if (measureDiv.clientHeight > MAX_SUMMARY_HEIGHT && currSummary.length > 0) {
                summaryPages.push(currSummary.join('')); 
                currSummary = [block];
            } else {
                currSummary.push(block);
            }
        });
        if (currSummary.length > 0) summaryPages.push(currSummary.join(''));

        const totalPdfPages = tablePages.length + summaryPages.length;
        let globalPageNum = 1;

        for (let i = 0; i < tablePages.length; i++) {
            processingState.message = `កំពុងគូរតារាងទំព័រទី ${globalPageNum}...`;
            const mainTitle = i === 0 ? `<div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #4f46e5;"><h1 style="font-size: 26px; font-weight: 900; color: #0f172a; margin: 0;">របាយការណ៍គណនេយ្យលម្អិត</h1><p style="font-size: 15px; color: #64748b; margin: 8px 0 0 0; font-weight: bold;">កាលបរិច្ឆេទ: <span style="color: #334155; font-weight: 900;">${reportDateLabel}</span> &nbsp;|&nbsp; សម្រាប់: <span style="color: #334155; font-weight: 900;">${reportAdminLabel}</span></p></div>` : "";
            const footerHTML = `<div style="position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 13px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between;"><span>ដោយ: ${adminName}</span><span>ទំព័រទី ${globalPageNum} នៃ ${totalPdfPages}</span></div>`;
            
            printStagingRef.innerHTML = `
                <div class="print-page" style="width: 1000px; height: 1414px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; font-family: 'Kantumruy Pro', 'Battambang', sans-serif; line-height: 1.6; position: relative; overflow:hidden;">
                    <div style="flex: 1;">${mainTitle}${wrapTable(tablePages[i])}</div>
                    ${footerHTML}
                </div>
            `;
            await nextTick(); await document.fonts.ready; await new Promise(r => setTimeout(r, 600)); 
            const canvas = await html2canvas(printStagingRef.querySelector('.print-page'), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            if (globalPageNum > 1) pdf.addPage();
            const imgProps = pdf.getImageProperties(imgData);
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, (imgProps.height * pdfWidth) / imgProps.width);
            processingState.progress = Math.round((globalPageNum / totalPdfPages) * 100);
            globalPageNum++;
        }

        for (let i = 0; i < summaryPages.length; i++) {
            processingState.message = `កំពុងគូររបាយការណ៍តំបន់ទំព័រទី ${globalPageNum}...`;
            const footerHTML = `<div style="position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 13px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between;"><span>ដោយ: ${adminName}</span><span>ទំព័រទី ${globalPageNum} នៃ ${totalPdfPages}</span></div>`;
            
            printStagingRef.innerHTML = `
                <div class="print-page" style="width: 1000px; height: 1414px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; font-family: 'Kantumruy Pro', 'Battambang', sans-serif; line-height: 1.6; position: relative; overflow:hidden;">
                    <div style="flex: 1;">${summaryPages[i]}</div>
                    ${footerHTML}
                </div>
            `;
            await nextTick(); await document.fonts.ready; await new Promise(r => setTimeout(r, 600)); 
            const canvas = await html2canvas(printStagingRef.querySelector('.print-page'), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            pdf.addPage();
            const imgProps = pdf.getImageProperties(imgData);
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, (imgProps.height * pdfWidth) / imgProps.width);
            processingState.progress = Math.round((globalPageNum / totalPdfPages) * 100);
            globalPageNum++;
        }

        document.body.removeChild(measureDiv);
        processingState.message = 'កំពុងរក្សាទុកឯកសារ...'; processingState.progress = 100;
        pdf.save(`Accounting_Report_${new Date().getTime()}.pdf`);
        
    } catch(e) {
        console.error(e);
        alert("មានបញ្ហា មិនអាចទាញយក PDF បានទេ!");
    } finally {
        if(printStagingRef) printStagingRef.innerHTML = '';
        processingState.active = false;
    }
};

// ==========================================
// 🌟 6. EXCEL GENERATOR 🌟
// ==========================================
export const generateExcel = async (rowsToPrint, allSales, advancedPrintStats, reportDateLabel, reportAdminLabel, adminName, unitSettings, processingState) => {
    processingState.active = true; processingState.message = 'កំពុងរៀបចំទិន្នន័យ Excel...'; processingState.progress = 30;

    try {
        const { allCombos, allStocks } = await fetchCombosAndStocks();
        processingState.progress = 50;

        let mainTableRows = '';
        rowsToPrint.forEach(item => {
            const hasS = item.hasSales;
            const cStr = hasS ? item.totalClients : '-';
            const rUSD = hasS ? fC(item.revenueUSD) : '-';
            const rKHR = hasS ? fC(item.revenueKHR) : '-';
            
            mainTableRows += `
                <tr>
                    <td style="border: 1px solid #cbd5e1; text-align: center; font-weight: bold; background-color: #f8fafc;">${item.printIndex}</td>
                    <td colspan="2" style="border: 1px solid #cbd5e1; font-weight: bold; font-size: 14px; background-color: #f8fafc;">${item.fullName}</td>
                    <td style="border: 1px solid #cbd5e1; text-align: center; background-color: #f8fafc; font-weight: bold;">អតិថិជន: ${cStr}</td>
                    <td style="border: 1px solid #cbd5e1; text-align: right; color:#059669; font-weight:bold; background-color: #f8fafc;">${rUSD} $</td>
                    <td colspan="4" style="border: 1px solid #cbd5e1; text-align: right; color:#2563eb; font-weight:bold; background-color: #f8fafc;">សរុបរៀល: ${rKHR} ៛</td>
                </tr>
            `;

            if (hasS) {
                const sortedProducts = getDetailedProductsSummary(item, { allSales }, allCombos, allStocks);
                for (let i = 0; i < sortedProducts.length; i += 2) {
                    const p1 = sortedProducts[i]; const p2 = sortedProducts[i+1];
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

        const generateSectionRows = (title, sectionData, showExpenses = false, expensesList = []) => {
            let sectionRows = `<tr><td colspan="9"></td></tr><tr><th colspan="9" style="background-color: #1e293b; color: white; font-size: 14pt; text-align: left;">${title}</th></tr>`;
            sectionRows += `<tr><th colspan="9" style="background-color: #d1fae5; color: #065f46; text-align: left;">✅ ទំនិញបានទូទាត់រួច (PAID)</th></tr>`;
            
            const addProductRows = (catName, catData) => {
                if(catData.products && catData.products.length > 0) {
                     sectionRows += `<tr><th colspan="9" style="background-color: #f1f5f9; text-align: left;">${catName} (អតិថិជន: ${fQ(catData.clients)})</th></tr>`;
                     sectionRows += `<tr><th colspan="3">ឈ្មោះទំនិញ</th><th colspan="2">បរិមាណ</th><th colspan="4">ចំណូលសរុប (USD)</th></tr>`;
                     catData.products.forEach(p => {
                         const unitLabel = p.isCombo ? 'ឈុត' : translateUnit(p.unit, unitSettings);
                         sectionRows += `<tr><td colspan="3" style="border: 1px solid #cbd5e1;">${p.name}</td><td colspan="2" style="border: 1px solid #cbd5e1; text-align: center;">${fQ(p.qty)} ${unitLabel}</td><td colspan="4" style="border: 1px solid #cbd5e1; text-align: right; color:#1e293b; font-weight:bold;">${fC(p.usd)} $</td></tr>`;
                     });
                     sectionRows += `<tr><td colspan="5" style="text-align: right; font-weight:bold; background-color:#f8fafc;">សរុប ${catName}:</td><td colspan="4" style="text-align: right; font-weight:bold; background-color:#f8fafc; color:#059669;">${fC(catData.itemPriceTotalUSD)} $</td></tr>`;
                }
            };
            
            addProductRows('លក់បោះដុំ (Wholesale)', sectionData.paid.wholesale);
            addProductRows('លក់រាយ (Retail)', sectionData.paid.retail);
            sectionRows += `<tr><td colspan="5" style="text-align: right; font-weight:bold; background-color:#ecfdf5;">ថ្លៃដឹកជញ្ជូនសរុប (Delivery Paid):</td><td colspan="4" style="text-align: right; font-weight:bold; background-color:#ecfdf5; color:#059669;">${fC(sectionData.paid.deliveryFeeUSD)} $</td></tr>`;

            sectionRows += `<tr><th colspan="9" style="background-color: #fef3c7; color: #92400e; text-align: left;">⏳ មិនទាន់បានទូទាត់ (PENDING)</th></tr>`;
            addProductRows('លក់បោះដុំ (Wholesale)', sectionData.unpaid.wholesale);
            addProductRows('លក់រាយ (Retail)', sectionData.unpaid.retail);
            sectionRows += `<tr><td colspan="5" style="text-align: right; font-weight:bold; background-color:#fffbeb;">ថ្លៃដឹកជញ្ជូនសរុប (Delivery Pending):</td><td colspan="4" style="text-align: right; font-weight:bold; background-color:#fffbeb; color:#d97706;">${fC(sectionData.unpaid.deliveryFeeUSD)} $</td></tr>`;

            if (showExpenses && expensesList.length > 0) {
                 sectionRows += `<tr><th colspan="9" style="background-color: #ffe4e6; color: #9f1239; text-align: left;">💸 ការចំណាយទូទៅ (EXPENSES)</th></tr>`;
                 sectionRows += `<tr><th colspan="4">បរិយាយ</th><th>អ្នកស្នើ</th><th colspan="4">តម្លៃ (USD)</th></tr>`;
                 expensesList.forEach(exp => {
                     let eUSD = exp.currency==='KHR' ? exp.amount/4000 : exp.amount;
                     sectionRows += `<tr><td colspan="4" style="border: 1px solid #cbd5e1;">${exp.reason}</td><td style="border: 1px solid #cbd5e1; text-align: center;">${exp.requester}</td><td colspan="4" style="border: 1px solid #cbd5e1; text-align: right; color:#e11d48; font-weight:bold;">${fC(eUSD)} $</td></tr>`;
                 });
                 sectionRows += `<tr><td colspan="5" style="text-align: right; font-weight:bold; background-color:#fff1f2;">សរុបចំណាយ:</td><td colspan="4" style="text-align: right; font-weight:bold; background-color:#fff1f2; color:#be123c;">${fC(sectionData.summary.totalExpensesUSD)} $</td></tr>`;
            }
            return sectionRows;
        };

        const stats = advancedPrintStats;
        const excelHTML = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head><meta charset="utf-8"><style>table { font-family: 'Battambang', Arial, sans-serif; border-collapse: collapse; } th { border: 1px solid #cbd5e1; padding: 10px; } td { border: 1px solid #cbd5e1; padding: 8px; }</style></head>
            <body>
                <table>
                    <tr><th colspan="9" style="font-size:18pt; text-align:center; background-color:#f1f5f9; height:40px;">របាយការណ៍គណនេយ្យលម្អិត</th></tr>
                    <tr><th colspan="9" style="font-size:12pt; text-align:center; background-color:#f1f5f9; font-weight:normal;">កាលបរិច្ឆេទ: ${reportDateLabel} | សម្រាប់: ${reportAdminLabel}</th></tr>
                    <tr><td colspan="9"></td></tr>
                    <tr><th colspan="9" style="background-color: #1e293b; color: white; font-size: 12pt; text-align: left;">បញ្ជីអ្នកគ្រប់គ្រង និងទំនិញលម្អិត</th></tr>
                    <tr style="background-color: #f8fafc;">
                        <th>#</th><th colspan="2">អ្នកគ្រប់គ្រង / ទំនិញទី១</th><th>បរិមាណទី១</th><th>ចំណូលទី១ (USD)</th><th colspan="2">ទំនិញទី២</th><th>បរិមាណទី២</th><th>ចំណូលទី២ (USD)</th>
                    </tr>
                    ${mainTableRows}
                    ${generateSectionRows('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', stats.grand, true, stats.expensesList)}
                    ${generateSectionRows('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', stats.pp)}
                    ${generateSectionRows('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', stats.prov)}
                    <tr><td colspan="9"></td></tr>
                    <tr><td colspan="9" style="text-align: right; color: #64748b;">ទាញយកដោយ: ${adminName} | ${new Date().toLocaleString('km-KH')}</td></tr>
                </table>
            </body>
            </html>
        `;

        processingState.progress = 100; processingState.message = 'រួចរាល់!';
        const blob = new Blob(['\ufeff', excelHTML], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `Accounting_Report_${new Date().getTime()}.xls`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch(e) {
        console.error(e);
        alert("មានបញ្ហាក្នុងការទាញយក Excel");
    } finally { setTimeout(() => { processingState.active = false; }, 500); }
};