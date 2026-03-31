import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { nextTick } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

// ==========================================
// 🌟 1. HELPER FUNCTIONS 🌟
// ==========================================
export function fC(val) { return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
export function fQ(val) { return Number(val || 0).toLocaleString('en-US'); }
export function formatCurrency(val, curr = "USD") { return Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (curr === "USD" ? " $" : " ៛"); }
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
export function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
    return chunks;
}

export function calculateAdminStats(item, allSales) {
    let invoiceCount = 0; let netProductUSD = 0; let deliveryPP_USD = 0; let deliveryProv_USD = 0;
    if (allSales && allSales.length > 0) {
        const targetId = item.originalSellerId || item.id || item.originalAdminId;
        const validSales = allSales.filter(s => (s.createdBy === targetId || s.uid === targetId) && s.paymentStatus !== 'CANCELED' && s.paymentStatus !== 'Canceled');
        invoiceCount = validSales.length;
        validSales.forEach(sale => {
            let dFee = Number(sale.deliveryFee) || 0;
            if (sale.deliveryCurrency === 'KHR' || sale.deliveryCurrency === '៛') dFee /= 4000;
            let pSum = 0;
            if (sale.items && sale.items.length > 0) {
                sale.items.forEach(prod => {
                    let pPrice = Number(prod.price || prod.retailPrice || 0); let pQty = Number(prod.qty || 1);
                    if (sale.currency === 'KHR' || sale.currency === '៛') pPrice /= 4000;
                    pSum += (pPrice * pQty);
                });
            } else {
                let sTotal = Number(sale.totalAmount) || 0;
                if (sale.currency === 'KHR' || sale.currency === '៛') sTotal /= 4000;
                pSum = Math.max(0, sTotal - dFee);
            }
            netProductUSD += pSum;
            const loc = (sale.province || sale.location || '').toLowerCase();
            if (loc.includes('ភ្នំពេញ') || loc.includes('phnom penh') || loc === 'pp') deliveryPP_USD += dFee;
            else deliveryProv_USD += dFee;
        });
    }
    const grandTotal = netProductUSD + deliveryPP_USD + deliveryProv_USD;
    return { invoiceCount, netProductUSD, deliveryPP_USD, deliveryProv_USD, grandTotal };
}

let cachedAllUsers = null;
const fetchAllUsers = async () => {
    if (!cachedAllUsers) {
        const uSnap = await getDocs(collection(db, 'users'));
        cachedAllUsers = uSnap.docs.map(d => ({id: d.id, ...d.data()}));
    }
    return cachedAllUsers;
};

export async function getSubSellersStats(adminItem, allSales) {
    const users = await fetchAllUsers();
    const targetAdminId = adminItem.originalSellerId || adminItem.id || adminItem.originalAdminId;
    const subSellers = users.filter(u => u.createdBy === targetAdminId && (u.role === 'seller' || u.role === 'dealer'));
    if (subSellers.length === 0) return [];
    let subSellerStats = [];
    subSellers.forEach(seller => {
        const sellerSales = allSales.filter(s => s.sellerName === seller.fullName && s.paymentStatus !== 'CANCELED' && s.paymentStatus !== 'Canceled');
        if (sellerSales.length > 0) {
            let invCount = sellerSales.length; let netProd = 0; let dPP = 0; let dProv = 0; let salesDetails = [];
            sellerSales.forEach(sale => {
                let dFee = Number(sale.deliveryFee) || 0;
                if (sale.deliveryCurrency === 'KHR' || sale.deliveryCurrency === '៛') dFee /= 4000;
                let pSum = 0;
                if (sale.items && sale.items.length > 0) {
                    sale.items.forEach(prod => {
                        let pPrice = Number(prod.price || prod.retailPrice || 0); let pQty = Number(prod.qty || 1);
                        if (sale.currency === 'KHR' || sale.currency === '៛') pPrice /= 4000;
                        pSum += (pPrice * pQty);
                    });
                } else {
                    let sTotal = Number(sale.totalAmount) || 0;
                    if (sale.currency === 'KHR' || sale.currency === '៛') sTotal /= 4000;
                    pSum = Math.max(0, sTotal - dFee);
                }
                netProd += pSum;
                let isPP = false;
                const loc = (sale.province || sale.location || '').toLowerCase();
                if (loc.includes('ភ្នំពេញ') || loc.includes('phnom penh') || loc === 'pp') { dPP += dFee; isPP = true; } 
                else dProv += dFee;
                salesDetails.push({ receiptId: sale.receiptId || 'N/A', dPP: isPP ? dFee : 0, dProv: !isPP ? dFee : 0 });
            });
            subSellerStats.push({ name: seller.fullName, invoiceCount: invCount, netProductUSD: netProd, deliveryPP_USD: dPP, deliveryProv_USD: dProv, grandTotal: netProd + dPP + dProv, salesDetails: salesDetails });
        }
    });

    const adminSelfSales = allSales.filter(s => (s.createdBy === targetAdminId || s.uid === targetAdminId) && (!s.sellerName || s.sellerName === adminItem.fullName) && s.paymentStatus !== 'CANCELED' && s.paymentStatus !== 'Canceled');
    if (adminSelfSales.length > 0) {
        let invCount = adminSelfSales.length; let netProd = 0; let dPP = 0; let dProv = 0; let salesDetails = [];
        adminSelfSales.forEach(sale => {
            let dFee = Number(sale.deliveryFee) || 0;
            if (sale.deliveryCurrency === 'KHR') dFee /= 4000;
            let pSum = 0;
            if (sale.items && sale.items.length > 0) {
                sale.items.forEach(prod => {
                    let pPrice = Number(prod.price || 0);
                    if (sale.currency === 'KHR') pPrice /= 4000;
                    pSum += (pPrice * Number(prod.qty || 1));
                });
            } else {
                let sTotal = Number(sale.totalAmount) || 0;
                if (sale.currency === 'KHR') sTotal /= 4000;
                pSum = Math.max(0, sTotal - dFee);
            }
            netProd += pSum;
            let isPP = false;
            const loc = (sale.province || sale.location || '').toLowerCase();
            if (loc.includes('ភ្នំពេញ') || loc === 'pp') { dPP += dFee; isPP = true; } else dProv += dFee;
            salesDetails.push({ receiptId: sale.receiptId || 'N/A', dPP: isPP ? dFee : 0, dProv: !isPP ? dFee : 0 });
        });
        subSellerStats.unshift({ name: `${adminItem.fullName} (ផ្ទាល់)`, invoiceCount: invCount, netProductUSD: netProd, deliveryPP_USD: dPP, deliveryProv_USD: dProv, grandTotal: netProd + dPP + dProv, isAdminDirect: true, salesDetails: salesDetails });
    }
    return subSellerStats;
}

let cachedCombos = null; let cachedStocks = null;
const fetchCombosAndStocks = async () => {
    if (!cachedCombos) { const cSnap = await getDocs(collection(db, 'combos')); cachedCombos = cSnap.docs.map(d => ({id: d.id, ...d.data()})); }
    if (!cachedStocks) { const sSnap = await getDocs(collection(db, 'stocks')); cachedStocks = sSnap.docs.map(d => ({id: d.id, ...d.data()})); }
    return { allCombos: cachedCombos, allStocks: cachedStocks };
};

export function getDetailedProductsSummary(item, data, allCombos, allStocks) {
    let productsToProcess = [];
    if (data.allSales && data.allSales.length > 0) {
        const targetId = item.originalSellerId || item.id || item.originalAdminId;
        const validSales = data.allSales.filter(s => (s.createdBy === targetId || s.uid === targetId) && s.paymentStatus !== 'CANCELED' && s.paymentStatus !== 'Canceled');
        validSales.forEach(sale => { (sale.items || []).forEach(prod => { productsToProcess.push({ ...prod, saleCurrency: sale.currency }); }); });
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
                    productSummary[key].qty += subQty; productSummary[key].usd += distributedUsd;
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
        productSummary[key].qty += calculatedQty; productSummary[key].usd += itemTotalUsd;
    });
    return Object.values(productSummary).sort((a, b) => {
        if (a.name === b.name) return b.unitPrice - a.unitPrice; 
        return a.name.localeCompare(b.name); 
    });
}

// ==========================================
// 🌟 3. គូរតារាងវិក្កយបត្រ (Row Template PDF/Print) 
// ==========================================
const renderOwnerRowHTML = async (item, data, allCombos, allStocks, unitSettings, exportConfig) => {
    if (!exportConfig.showAdminTable) return ''; // 🌟 បើបិទតារាងមេ គឺមិនបង្ហាញអ្វីទាំងអស់

    const stats = calculateAdminStats(item, data.allSales);
    const hasS = item.hasSales;
    
    let rowsHTML = `
      <tr style="border-bottom: 2px solid #cbd5e1; ${!hasS ? "background-color: #f8fafc;" : ""}; break-inside: avoid; page-break-inside: avoid;">
          <td style="padding: 12px 8px; text-align: center; font-weight: 900; color: #1e293b; font-size: 13px;">${item.printIndex}</td>
          <td style="padding: 12px 8px; font-weight: 900; color: #1e293b; font-size: 14px;">${item.fullName || item.name || 'មិនស្គាល់'}</td>
          <td style="padding: 12px 8px; text-align: center; font-weight: 900; color: #4338ca; font-size: 14px;">${hasS ? fQ(stats.invoiceCount) + " បុង" : "-"}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: 900; color: #059669; font-size: 14px;">${hasS ? fC(stats.netProductUSD) + " $" : "-"}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: 900; color: #d97706; font-size: 14px;">${hasS ? fC(stats.deliveryPP_USD) + " $" : "-"}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: 900; color: #ea580c; font-size: 14px;">${hasS ? fC(stats.deliveryProv_USD) + " $" : "-"}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: 900; color: #e11d48; font-size: 15px;">${hasS ? fC(stats.grandTotal) + " $" : "-"}</td>
      </tr>
    `;

    // 🌟 បង្ហាញកូនចៅ
    if (hasS && exportConfig.showSubSellers) {
        const subSellers = await getSubSellersStats(item, data.allSales);
        if (subSellers.length > 0) {
            subSellers.forEach(sub => {
                rowsHTML += `
                <tr style="background-color: #f8fafc; border-bottom: 1px dashed #cbd5e1; break-inside: avoid; page-break-inside: avoid;">
                    <td></td>
                    <td style="padding: 8px 12px; font-weight: bold; color: ${sub.isAdminDirect ? '#4f46e5' : '#64748b'}; font-size: 12px;">↳ ${sub.name}</td>
                    <td style="padding: 8px 12px; text-align: center; color: #64748b; font-size: 12px; font-weight: bold;">${fQ(sub.invoiceCount)} បុង</td>
                    <td style="padding: 8px 12px; text-align: right; color: #64748b; font-size: 12px; font-weight: bold;">${fC(sub.netProductUSD)} $</td>
                    <td style="padding: 8px 12px; text-align: right; color: #d97706; font-size: 12px; font-weight: bold;">${fC(sub.deliveryPP_USD)} $</td>
                    <td style="padding: 8px 12px; text-align: right; color: #ea580c; font-size: 12px; font-weight: bold;">${fC(sub.deliveryProv_USD)} $</td>
                    <td style="padding: 8px 12px; text-align: right; font-weight: bold; color: #334155; font-size: 12px;">${fC(sub.grandTotal)} $</td>
                </tr>
                `;

                // 🌟 បង្ហាញលេខបុង
                if (exportConfig.showInvoices && sub.salesDetails && sub.salesDetails.length > 0) {
                    sub.salesDetails.forEach(detail => {
                        rowsHTML += `
                        <tr style="background-color: #ffffff; break-inside: avoid; page-break-inside: avoid;">
                            <td></td>
                            <td style="padding: 4px 12px 4px 30px; color: #94a3b8; font-size: 10px; font-family: monospace;">🧾 ${detail.receiptId}</td>
                            <td style="text-align: center; color: #cbd5e1;">-</td>
                            <td style="text-align: right; color: #cbd5e1;">-</td>
                            <td style="padding: 4px 12px; text-align: right; color: #f59e0b; font-size: 10px;">${detail.dPP > 0 ? fC(detail.dPP) + ' $' : '-'}</td>
                            <td style="padding: 4px 12px; text-align: right; color: #fdba74; font-size: 10px;">${detail.dProv > 0 ? fC(detail.dProv) + ' $' : '-'}</td>
                            <td style="text-align: right; color: #cbd5e1;">-</td>
                        </tr>
                        `;
                    });
                }
            });
        }
    }

    // 🌟 បង្ហាញបញ្ជីទំនិញលម្អិត
    if (hasS && exportConfig.showProducts) {
        const sortedProducts = getDetailedProductsSummary(item, data, allCombos, allStocks);
        if (sortedProducts.length > 0) {
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

            rowsHTML += `
                <tr style="background: #ffffff; break-inside: avoid; page-break-inside: avoid;">
                    <td></td>
                    <td colspan="6" style="padding: 10px 15px 20px 15px;">
                        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 15px; background: #f8fafc;">
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

    return `<tbody style="border-bottom: 3px solid #94a3b8;">${rowsHTML}</tbody>`;
};

// ==========================================
// 🌟 4. មុខងារគូរ HTML ទំព័រសរុប 🌟
// ==========================================
const renderProductGridFlex = (productsArray, unitSettings) => {
    const cards = productsArray.map((p) => {
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

const buildRegionBlocks = (title, data, isGrandTotal = false, expensesList = [], unitSettings = [], config = {}) => {
    let blocks = [];
    
    blocks.push(`
        <div style="background: #1e293b; color: white; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 12px 12px 0 0; margin-top: 20px; break-inside: avoid; page-break-inside: avoid;">
            <span style="font-size: 16px; font-weight: 900;">${title}</span>
            <span style="font-size: 13px; font-weight: bold; background: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 20px;">អតិថិជនសរុប: ${fQ(data.totalClients)} នាក់</span>
        </div>
    `);

    const addProductBlocks = (statusTitle, statusEmoji, catName, products, accentColor, totalItemPrice) => {
        if (!products || products.length === 0 || !config.showProducts) return; // Hide product grid if disabled
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

    if (isGrandTotal && expensesList.length > 0 && config.showExpenses !== false) {
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
                    ${config.showExpenses !== false ? `<div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #be123c; font-weight: bold;"><span>ចំណាយសរុប (Expenses):</span><span style="font-size: 14px; font-weight: 900;">- ${fC(data.summary.totalExpensesUSD)} $</span></div>` : ''}
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
export const executeNativePrint = async (rowsToPrint, allSales, advancedPrintStats, reportDateLabel, reportAdminLabel, unitSettings, exportConfig) => {
    const { allCombos, allStocks } = await fetchCombosAndStocks();
    const stats = advancedPrintStats;

    let allRowsHtml = '';
    if (exportConfig.showAdminTable) {
        for (const r of rowsToPrint) {
            allRowsHtml += await renderOwnerRowHTML(r, { allSales }, allCombos, allStocks, unitSettings, exportConfig);
        }
    }

    const tableHTML = exportConfig.showAdminTable ? `
        <table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff; margin-bottom: 30px;">
            <thead style="background: #1e293b; color: #ffffff; font-size: 12px; font-weight: 900; display: table-header-group;">
                <tr>
                    <th style="padding: 14px 8px; width: 5%; text-align: center;">ល.រ</th>
                    <th style="padding: 14px 8px; width: 25%;">តំណាងលក់ (SELLER)</th>
                    <th style="padding: 14px 8px; width: 12%; text-align: center;">ចំនួនវិក្កយបត្រ</th>
                    <th style="padding: 14px 8px; width: 14%; text-align: right;">ប្រាក់ទំនិញសុទ្ធ</th>
                    <th style="padding: 14px 8px; width: 14%; text-align: right;">ថ្លៃដឹក(ភ្នំពេញ)</th>
                    <th style="padding: 14px 8px; width: 14%; text-align: right;">ថ្លៃដឹក(ខេត្ត)</th>
                    <th style="padding: 14px 8px; width: 16%; text-align: right;">សរុបរួម</th>
                </tr>
            </thead>
            ${allRowsHtml}
        </table>
    ` : '';

    let summaryHTML = '';
    if (exportConfig.showGrandTotal) summaryHTML += buildRegionBlocks('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', stats.grand, true, stats.expensesList, unitSettings, exportConfig).join('');
    if (exportConfig.showPhnomPenh) summaryHTML += buildRegionBlocks('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', stats.pp, false, [], unitSettings, exportConfig).join('');
    if (exportConfig.showProvince) summaryHTML += buildRegionBlocks('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', stats.prov, false, [], unitSettings, exportConfig).join('');

    const mainTitle = `<div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #4f46e5;"><h1 style="font-size: 22px; font-weight: 900; color: #4338ca; margin: 0;">របាយការណ៍គណនេយ្យលម្អិត</h1><p style="font-size: 13px; color: #64748b; margin: 6px 0 0 0; font-weight: bold;">កាលបរិច្ឆេទ: <span style="color: #334155; font-weight: 900;">${reportDateLabel}</span> &nbsp;|&nbsp; សម្រាប់: <span style="color: #334155; font-weight: 900;">${reportAdminLabel}</span></p></div>`;

    const contentHTML = `
        <div class="print-wrapper" style="width: 100%; box-sizing: border-box; font-family: 'Battambang', 'Kantumruy Pro', sans-serif; line-height: 1.5;">
            ${mainTitle}
            ${tableHTML}
            ${summaryHTML !== '' && exportConfig.showAdminTable ? `<div style="page-break-before: always; margin-top:40px;"></div>` : ''}
            ${summaryHTML !== '' ? `<div style="text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 20px;"><h3 style="font-size: 20px; font-weight: 900; color: #1e293b; margin: 0;">របាយការណ៍លម្អិតតាមតំបន់</h3></div>` : ''}
            ${summaryHTML}
        </div>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute"; iframe.style.width = "0"; iframe.style.height = "0"; iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
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
                    tbody, div { page-break-inside: auto !important; break-inside: auto !important; }
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

// 🌟 មុខងារ PDF ថ្មី ដែលដោះស្រាយបញ្ហាជាន់ Footer 🌟
export const generatePDF = async (rowsToPrint, allSales, advancedPrintStats, reportDateLabel, reportAdminLabel, adminName, unitSettings, processingState, printStagingRef, exportConfig) => {
    processingState.active = true; processingState.message = 'កំពុងរៀបចំទំព័រ PDF...'; processingState.progress = 10;
    
    try {
        const { allCombos, allStocks } = await fetchCombosAndStocks();
        const stats = advancedPrintStats;
        const pdf = new jsPDF('p', 'mm', 'a4'); 

        // 🌟 1. បង្កើត Container សម្រាប់វាស់ទំហំកម្ពស់ទំព័រ
        const measureDiv = document.createElement('div');
        measureDiv.style.width = '920px'; // 1000px width - 80px padding
        measureDiv.style.fontFamily = "'Battambang', 'Kantumruy Pro', sans-serif";
        measureDiv.style.position = 'absolute'; measureDiv.style.visibility = 'hidden'; measureDiv.style.top = '-9999px';
        document.body.appendChild(measureDiv);

        let tablePages = [];
        let currentRows = [];
        let isFirstTablePage = true;

        const tableHeader = `
            <thead style="background: #1e293b; color: #ffffff; font-size: 12px; font-weight: 900;">
                <tr>
                    <th style="padding: 14px 8px; width: 5%; text-align: center; border-bottom: 2px solid #cbd5e1;">ល.រ</th>
                    <th style="padding: 14px 8px; width: 25%; border-bottom: 2px solid #cbd5e1;">តំណាងលក់ (SELLER)</th>
                    <th style="padding: 14px 8px; width: 12%; text-align: center; border-bottom: 2px solid #cbd5e1;">ចំនួនវិក្កយបត្រ</th>
                    <th style="padding: 14px 8px; width: 14%; text-align: right; border-bottom: 2px solid #cbd5e1;">ប្រាក់ទំនិញសុទ្ធ</th>
                    <th style="padding: 14px 8px; width: 14%; text-align: right; border-bottom: 2px solid #cbd5e1;">ថ្លៃដឹក(ភ្នំពេញ)</th>
                    <th style="padding: 14px 8px; width: 14%; text-align: right; border-bottom: 2px solid #cbd5e1;">ថ្លៃដឹក(ខេត្ត)</th>
                    <th style="padding: 14px 8px; width: 16%; text-align: right; border-bottom: 2px solid #cbd5e1;">សរុបរួម</th>
                </tr>
            </thead>
        `;

        const wrapTable = (rowsHtml) => `<table style="width: 100%; text-align: left; border-collapse: collapse; background-color: #ffffff;">${tableHeader}${rowsHtml}</table>`;

        // 🌟 2. វាស់កាត់ទិន្នន័យតារាង (Table Pagination)
        if (exportConfig.showAdminTable) {
            for (const r of rowsToPrint) {
                const rowHtml = await renderOwnerRowHTML(r, { allSales }, allCombos, allStocks, unitSettings, exportConfig);
                measureDiv.innerHTML = wrapTable(currentRows.join('') + rowHtml);
                
                // កម្ពស់សុវត្ថិភាពទំព័រទី១ (មាន Header ធំ) = 900px, ទំព័របន្តបន្ទាប់ = 1080px
                const currentMaxHeight = isFirstTablePage ? 900 : 1080;

                if (measureDiv.clientHeight > currentMaxHeight && currentRows.length > 0) {
                    tablePages.push(currentRows.join(''));
                    currentRows = [rowHtml];
                    isFirstTablePage = false;
                } else {
                    currentRows.push(rowHtml);
                }
            }
            if (currentRows.length > 0) tablePages.push(currentRows.join(''));
        }

        // 🌟 3. វាស់កាត់ទិន្នន័យតំបន់និងចំណាយ (Summary Blocks Pagination)
        let summaryPages = [];
        let currSummary = [];
        let isFirstSummaryPage = true;

        let allSummaryBlocks = [];
        if (exportConfig.showGrandTotal || exportConfig.showPhnomPenh || exportConfig.showProvince) {
            allSummaryBlocks.push(`<div style="text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 20px;"><h3 style="font-size: 20px; font-weight: 900; color: #1e293b; margin: 0;">របាយការណ៍លម្អិតតាមតំបន់</h3></div>`);
            if (exportConfig.showGrandTotal) allSummaryBlocks.push(...buildRegionBlocks('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', stats.grand, true, stats.expensesList, unitSettings, exportConfig));
            if (exportConfig.showPhnomPenh) allSummaryBlocks.push(...buildRegionBlocks('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', stats.pp, false, [], unitSettings, exportConfig));
            if (exportConfig.showProvince) allSummaryBlocks.push(...buildRegionBlocks('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', stats.prov, false, [], unitSettings, exportConfig));
        }

        for (const block of allSummaryBlocks) {
            measureDiv.innerHTML = currSummary.join('') + block;
            
            // បើគ្មានតារាងទេ ទំព័រសរុបនេះជាទំព័រទី១ (មាន Header ធំ)
            const isVeryFirstPage = isFirstSummaryPage && tablePages.length === 0;
            const currentMaxHeight = isVeryFirstPage ? 900 : 1080;

            if (measureDiv.clientHeight > currentMaxHeight && currSummary.length > 0) {
                summaryPages.push(currSummary.join(''));
                currSummary = [block];
                isFirstSummaryPage = false;
            } else {
                currSummary.push(block);
            }
        }
        if (currSummary.length > 0) summaryPages.push(currSummary.join(''));

        document.body.removeChild(measureDiv);

        const totalPdfPages = tablePages.length + summaryPages.length;
        let globalPageNum = 1;

        // 🌟 Template សម្រាប់ Header និង Footer
        const getPageHeader = (isFirstPage) => {
            if (isFirstPage) {
                return `<div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #4f46e5;"><h1 style="font-size: 26px; font-weight: 900; color: #0f172a; margin: 0;">របាយការណ៍គណនេយ្យលម្អិត</h1><p style="font-size: 15px; color: #64748b; margin: 8px 0 0 0; font-weight: bold;">កាលបរិច្ឆេទ: <span style="color: #334155; font-weight: 900;">${reportDateLabel}</span> &nbsp;|&nbsp; សម្រាប់: <span style="color: #334155; font-weight: 900;">${reportAdminLabel}</span></p></div>`;
            }
            return `<div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0;"><h2 style="font-size: 16px; font-weight: 900; color: #64748b; margin: 0;">របាយការណ៍គណនេយ្យលម្អិត (បន្ត)</h2></div>`;
        };

        const getPageFooter = (pageNum) => `
            <div style="flex-shrink: 0; margin-top: auto; border-top: 2px solid #e2e8f0; padding-top: 15px; font-size: 13px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between; background: white;">
                <span>ដោយ: ${adminName} | ទាញយកនៅ: ${new Date().toLocaleString('km-KH')}</span>
                <span>ទំព័រទី ${pageNum} នៃ ${totalPdfPages}</span>
            </div>
        `;

        const renderPageToCanvas = async (contentHtml, isFirst) => {
            printStagingRef.innerHTML = `
                <div class="print-page" style="width: 1000px; height: 1414px; background: white; padding: 40px; box-sizing: border-box; font-family: 'Kantumruy Pro', 'Battambang', sans-serif; line-height: 1.6; display: flex; flex-direction: column;">
                    <div style="flex-shrink: 0;">${getPageHeader(isFirst)}</div>
                    <div style="flex-grow: 1; align-content: flex-start; overflow: hidden;">${contentHtml}</div>
                    ${getPageFooter(globalPageNum)}
                </div>
            `;
            await nextTick(); await document.fonts.ready; await new Promise(r => setTimeout(r, 600)); 
            return await html2canvas(printStagingRef.querySelector('.print-page'), { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        };

        // 🌟 4. គូរទំព័រតារាង
        for (let i = 0; i < tablePages.length; i++) {
            processingState.message = `កំពុងគូរតារាងទំព័រទី ${globalPageNum}...`;
            const canvas = await renderPageToCanvas(wrapTable(tablePages[i]), globalPageNum === 1);
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            if (globalPageNum > 1) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            processingState.progress = Math.round((globalPageNum / totalPdfPages) * 100);
            globalPageNum++;
        }

        // 🌟 5. គូរទំព័រសរុបតំបន់
        for (let i = 0; i < summaryPages.length; i++) {
            processingState.message = `កំពុងគូររបាយការណ៍តំបន់ទំព័រទី ${globalPageNum}...`;
            const canvas = await renderPageToCanvas(summaryPages[i], globalPageNum === 1 && tablePages.length === 0);
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            if (globalPageNum > 1) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            processingState.progress = Math.round((globalPageNum / totalPdfPages) * 100);
            globalPageNum++;
        }

        processingState.message = 'កំពុងរក្សាទុកឯកសារ...'; 
        processingState.progress = 100;
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
// 🌟 6. EXCEL GENERATOR (NEW SMART TABLE) 🌟
// ==========================================
export const generateExcel = async (rowsToPrint, allSales, advancedPrintStats, reportDateLabel, reportAdminLabel, adminName, unitSettings, processingState, exportConfig) => {
    processingState.active = true; processingState.message = 'កំពុងរៀបចំទិន្នន័យ Excel...'; processingState.progress = 30;

    try {
        const { allCombos, allStocks } = await fetchCombosAndStocks();
        processingState.progress = 50;

        let mainTableRows = '';
        
        if (exportConfig.showAdminTable) {
            for (const item of rowsToPrint) {
                const stats = calculateAdminStats(item, allSales);
                const hasS = item.hasSales;
                
                mainTableRows += `
                    <tr>
                        <td style="border: 1px solid #cbd5e1; text-align: center; font-weight: bold; background-color: #f8fafc;">${item.printIndex}</td>
                        <td style="border: 1px solid #cbd5e1; font-weight: bold; font-size: 13pt; background-color: #f8fafc;">${item.fullName}</td>
                        <td style="border: 1px solid #cbd5e1; text-align: center; background-color: #f8fafc; font-weight: bold; color: #4338ca;">${hasS ? stats.invoiceCount + " បុង" : "-"}</td>
                        <td style="border: 1px solid #cbd5e1; text-align: right; color:#059669; font-weight:bold; background-color: #f8fafc;">${hasS ? fC(stats.netProductUSD) + " $" : "-"}</td>
                        <td style="border: 1px solid #cbd5e1; text-align: right; color:#d97706; font-weight:bold; background-color: #f8fafc;">${hasS ? fC(stats.deliveryPP_USD) + " $" : "-"}</td>
                        <td style="border: 1px solid #cbd5e1; text-align: right; color:#ea580c; font-weight:bold; background-color: #f8fafc;">${hasS ? fC(stats.deliveryProv_USD) + " $" : "-"}</td>
                        <td style="border: 1px solid #cbd5e1; text-align: right; color:#e11d48; font-weight:bold; background-color: #f8fafc; font-size: 13pt;">${hasS ? fC(stats.grandTotal) + " $" : "-"}</td>
                    </tr>
                `;

                if (hasS && exportConfig.showSubSellers) {
                    const subSellers = await getSubSellersStats(item, allSales);
                    if (subSellers.length > 0) {
                        subSellers.forEach(sub => {
                            mainTableRows += `
                            <tr>
                                <td style="border: 1px solid #cbd5e1; background-color: #ffffff;"></td>
                                <td style="border: 1px solid #cbd5e1; color: ${sub.isAdminDirect ? '#4f46e5' : '#64748b'}; font-weight:bold; background-color: #ffffff;">↳ ${sub.name}</td>
                                <td style="border: 1px solid #cbd5e1; text-align: center; color: #64748b; font-weight: bold; background-color: #ffffff;">${fQ(sub.invoiceCount)} បុង</td>
                                <td style="border: 1px solid #cbd5e1; text-align: right; color: #64748b; background-color: #ffffff;">${fC(sub.netProductUSD)} $</td>
                                <td style="border: 1px solid #cbd5e1; text-align: right; color: #64748b; background-color: #ffffff;">${fC(sub.deliveryPP_USD)} $</td>
                                <td style="border: 1px solid #cbd5e1; text-align: right; color: #64748b; background-color: #ffffff;">${fC(sub.deliveryProv_USD)} $</td>
                                <td style="border: 1px solid #cbd5e1; text-align: right; color: #334155; font-weight: bold; background-color: #ffffff;">${fC(sub.grandTotal)} $</td>
                            </tr>
                            `;

                            if (exportConfig.showInvoices && sub.salesDetails && sub.salesDetails.length > 0) {
                                sub.salesDetails.forEach(detail => {
                                    mainTableRows += `
                                    <tr>
                                        <td style="border: 1px solid #cbd5e1; background-color: #ffffff;"></td>
                                        <td style="border: 1px solid #cbd5e1; color: #94a3b8; background-color: #ffffff; font-size: 10pt;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧾 លេខបុង: ${detail.receiptId}</td>
                                        <td style="border: 1px solid #cbd5e1; text-align: center; color: #cbd5e1; background-color: #ffffff;">-</td>
                                        <td style="border: 1px solid #cbd5e1; text-align: right; color: #cbd5e1; background-color: #ffffff;">-</td>
                                        <td style="border: 1px solid #cbd5e1; text-align: right; color: #f59e0b; background-color: #ffffff; font-size: 10pt;">${detail.dPP > 0 ? fC(detail.dPP) + ' $' : '-'}</td>
                                        <td style="border: 1px solid #cbd5e1; text-align: right; color: #ea580c; background-color: #ffffff; font-size: 10pt;">${detail.dProv > 0 ? fC(detail.dProv) + ' $' : '-'}</td>
                                        <td style="border: 1px solid #cbd5e1; text-align: right; color: #cbd5e1; background-color: #ffffff;">-</td>
                                    </tr>
                                    `;
                                });
                            }
                        });
                    }
                }

                if (hasS && exportConfig.showProducts) {
                    const sortedProducts = getDetailedProductsSummary(item, { allSales }, allCombos, allStocks);
                    for (let i = 0; i < sortedProducts.length; i += 2) {
                        const p1 = sortedProducts[i]; const p2 = sortedProducts[i+1];
                        mainTableRows += `<tr>
                            <td style="border: 1px solid #cbd5e1;"></td>
                            <td style="border: 1px solid #cbd5e1; color: #1e293b; font-weight:bold;">• ${p1.name}</td>
                            <td colspan="2" style="border: 1px solid #cbd5e1; text-align: center; color: #475569; font-weight: bold;">${fQ(p1.qty)} ដប <span style="font-size:11px; color:#94a3b8;">(${fC(p1.unitPrice)}$)</span> = <span style="color:#0f172a;">${fC(p1.usd)} $</span></td>
                            ${p2 ? `
                                <td colspan="2" style="border: 1px solid #cbd5e1; color: #1e293b; font-weight:bold;">• ${p2.name}</td>
                                <td style="border: 1px solid #cbd5e1; text-align: center; color: #475569; font-weight: bold;">${fQ(p2.qty)} ដប <span style="font-size:11px; color:#94a3b8;">(${fC(p2.unitPrice)}$)</span> = <span style="color:#0f172a;">${fC(p2.usd)} $</span></td>
                            ` : `<td colspan="3" style="border: 1px solid #cbd5e1;"></td>`}
                        </tr>`;
                    }
                }
            }
        }

        const generateSectionRows = (title, sectionData, showExpenses = false, expensesList = []) => {
            let sectionRows = `<tr><td colspan="7"></td></tr><tr><th colspan="7" style="background-color: #1e293b; color: white; font-size: 14pt; text-align: left; padding: 10px;">${title}</th></tr>`;
            sectionRows += `<tr><th colspan="7" style="background-color: #d1fae5; color: #065f46; text-align: left; padding: 8px;">✅ ទំនិញបានទូទាត់រួច (PAID)</th></tr>`;
            
            const addProductRows = (catName, catData) => {
                if(catData.products && catData.products.length > 0 && exportConfig.showProducts) {
                     sectionRows += `<tr><th colspan="7" style="background-color: #f1f5f9; text-align: left; padding: 8px;">${catName} (អតិថិជន: ${fQ(catData.clients)})</th></tr>`;
                     sectionRows += `<tr><th colspan="3">ឈ្មោះទំនិញ</th><th colspan="2">បរិមាណ</th><th colspan="2">ចំណូលសរុប (USD)</th></tr>`;
                     catData.products.forEach(p => {
                         const unitLabel = p.isCombo ? 'ឈុត' : translateUnit(p.unit, unitSettings);
                         sectionRows += `<tr><td colspan="3" style="border: 1px solid #cbd5e1; padding: 8px;">${p.name}</td><td colspan="2" style="border: 1px solid #cbd5e1; text-align: center;">${fQ(p.qty)} ${unitLabel}</td><td colspan="2" style="border: 1px solid #cbd5e1; text-align: right; color:#1e293b; font-weight:bold;">${fC(p.usd)} $</td></tr>`;
                     });
                     sectionRows += `<tr><td colspan="5" style="text-align: right; font-weight:bold; background-color:#f8fafc; padding: 8px;">សរុប ${catName}:</td><td colspan="2" style="text-align: right; font-weight:bold; background-color:#f8fafc; color:#059669;">${fC(catData.itemPriceTotalUSD)} $</td></tr>`;
                }
            };
            
            addProductRows('លក់បោះដុំ (Wholesale)', sectionData.paid.wholesale);
            addProductRows('លក់រាយ (Retail)', sectionData.paid.retail);
            sectionRows += `<tr><td colspan="5" style="text-align: right; font-weight:bold; background-color:#ecfdf5; padding: 8px;">ថ្លៃដឹកជញ្ជូនសរុប (Delivery Paid):</td><td colspan="2" style="text-align: right; font-weight:bold; background-color:#ecfdf5; color:#059669;">${fC(sectionData.paid.deliveryFeeUSD)} $</td></tr>`;

            sectionRows += `<tr><th colspan="7" style="background-color: #fef3c7; color: #92400e; text-align: left; padding: 8px;">⏳ មិនទាន់បានទូទាត់ (PENDING)</th></tr>`;
            addProductRows('លក់បោះដុំ (Wholesale)', sectionData.unpaid.wholesale);
            addProductRows('លក់រាយ (Retail)', sectionData.unpaid.retail);
            sectionRows += `<tr><td colspan="5" style="text-align: right; font-weight:bold; background-color:#fffbeb; padding: 8px;">ថ្លៃដឹកជញ្ជូនសរុប (Delivery Pending):</td><td colspan="2" style="text-align: right; font-weight:bold; background-color:#fffbeb; color:#d97706;">${fC(sectionData.unpaid.deliveryFeeUSD)} $</td></tr>`;

            if (showExpenses && expensesList.length > 0 && exportConfig.showExpenses) {
                 sectionRows += `<tr><th colspan="7" style="background-color: #ffe4e6; color: #9f1239; text-align: left; padding: 8px;">💸 ការចំណាយទូទៅ (EXPENSES)</th></tr>`;
                 sectionRows += `<tr><th colspan="3">បរិយាយ</th><th colspan="2">អ្នកស្នើ</th><th colspan="2">តម្លៃ (USD)</th></tr>`;
                 expensesList.forEach(exp => {
                     let eUSD = exp.currency==='KHR' ? exp.amount/4000 : exp.amount;
                     sectionRows += `<tr><td colspan="3" style="border: 1px solid #cbd5e1; padding: 8px;">${exp.reason}</td><td colspan="2" style="border: 1px solid #cbd5e1; text-align: center;">${exp.requester}</td><td colspan="2" style="border: 1px solid #cbd5e1; text-align: right; color:#e11d48; font-weight:bold;">${fC(eUSD)} $</td></tr>`;
                 });
                 sectionRows += `<tr><td colspan="5" style="text-align: right; font-weight:bold; background-color:#fff1f2; padding: 8px;">សរុបចំណាយ:</td><td colspan="2" style="text-align: right; font-weight:bold; background-color:#fff1f2; color:#be123c;">${fC(sectionData.summary.totalExpensesUSD)} $</td></tr>`;
            }
            return sectionRows;
        };

        const stats = advancedPrintStats;
        let excelHTML = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8">
                <style>
                    table { font-family: 'Battambang', 'Arial', sans-serif; border-collapse: collapse; }
                    th { border: 1px solid #cbd5e1; padding: 10px; font-size: 11pt; }
                    td { border: 1px solid #cbd5e1; padding: 8px; font-size: 11pt; }
                    .main-th { background-color: #1e293b; color: #ffffff; font-weight: bold; }
                </style>
            </head>
            <body>
                <table>
                    <tr><th colspan="7" style="font-size:18pt; text-align:center; background-color:#f1f5f9; height:50px;">របាយការណ៍គណនេយ្យលម្អិត</th></tr>
                    <tr><th colspan="7" style="font-size:12pt; text-align:center; background-color:#f1f5f9; font-weight:normal; height:30px;">កាលបរិច្ឆេទ: ${reportDateLabel} | សម្រាប់: ${reportAdminLabel}</th></tr>
                    <tr><td colspan="7"></td></tr>
        `;
        
        if (exportConfig.showAdminTable) {
            excelHTML += `
                    <tr><th colspan="7" style="background-color: #1e293b; color: white; font-size: 13pt; text-align: left; padding: 10px;">បញ្ជីអ្នកគ្រប់គ្រង និងចំណូលលម្អិត</th></tr>
                    <tr class="main-th">
                        <th width="60">ល.រ</th>
                        <th width="300">តំណាងលក់ (SELLER)</th>
                        <th width="150">ចំនួនវិក្កយបត្រ</th>
                        <th width="180">ប្រាក់ទំនិញសុទ្ធ (USD)</th>
                        <th width="180">ថ្លៃដឹក(ភ្នំពេញ) (USD)</th>
                        <th width="180">ថ្លៃដឹក(ខេត្ត) (USD)</th>
                        <th width="180">សរុបរួម (USD)</th>
                    </tr>
                    ${mainTableRows}
            `;
        }

        if (exportConfig.showGrandTotal) excelHTML += generateSectionRows('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', stats.grand, true, stats.expensesList);
        if (exportConfig.showPhnomPenh) excelHTML += generateSectionRows('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', stats.pp);
        if (exportConfig.showProvince) excelHTML += generateSectionRows('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', stats.prov);
                    
        excelHTML += `
                    <tr><td colspan="7"></td></tr>
                    <tr><td colspan="7" style="text-align: right; color: #64748b; font-weight: bold;">ទាញយកដោយ: ${adminName} | ${new Date().toLocaleString('km-KH')}</td></tr>
                </table>
            </body>
            </html>
        `;

        processingState.progress = 100; processingState.message = 'រួចរាល់!';
        
        const blob = new Blob(['\ufeff', excelHTML], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `Accounting_Report_${new Date().getTime()}.xls`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch(e) {
        console.error(e);
        alert("មានបញ្ហាក្នុងការទាញយក Excel សូមពិនិត្យមើល Console!");
    } finally { setTimeout(() => { processingState.active = false; }, 500); }
};