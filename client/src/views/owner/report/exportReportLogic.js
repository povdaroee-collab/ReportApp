import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { nextTick } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

// 🌟 Cache ទិន្នន័យដើម្បីកុំឱ្យទាញយកញឹកញាប់ពេកពេលចុច Export ច្រើនដង
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

// Helper Functions
const fC = (val) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fQ = (val) => Number(val).toLocaleString('en-US');

const translateUnit = (unitVal, unitSettings) => {
    if (!unitVal) return '';
    const safeVal = String(unitVal);
    const found = unitSettings.find(u => String(u.value) === safeVal);
    if (found) return found.label;
    const u = safeVal.toLowerCase().trim();
    if (u === 'bottle' || u === 'bottles') return 'ដប';
    if (u === 'pack' || u === 'packs') return 'កញ្ចប់';
    if (u === 'case' || u === 'cases') return 'កេះ';
    if (u === 'set' || u === 'sets') return 'ឈុត';
    return safeVal; 
};

// ==============================================================
// 🌟 1. HTML Generator សម្រាប់ Print និង PDF 🌟
// ==============================================================

const generateMainTableHTML = (rows, allSales, unitSettings, allCombos, allStocks) => {
    if (rows.length === 0) return '';
    
    const renderRow = (item) => {
        let salesHTML = '';
        if (item.hasSales) {
            salesHTML = `<div style="display: flex; flex-wrap: wrap; gap: 8px;">` + 
                Object.entries(item.unitCounts || {}).filter(([u, c]) => c > 0).map(([u, c]) => 
                    `<div style="white-space: nowrap;">
                        <span style="font-weight: 900; color: #1e293b; font-size: 14px;">${c.toLocaleString()}</span>
                        <span style="color: #475569; font-size: 12px; font-weight: bold; margin-left: 2px;">${translateUnit(u, unitSettings)}</span>
                     </div>`
                ).join('') + `</div>`;
        } else {
            salesHTML = `<span style="font-size: 13px; font-weight: bold; color: #94a3b8;">គ្មានការលក់</span>`;
        }

        let revenueHTML = item.hasSales ? `
            <div style="text-align: right;">
                <span style="color:#059669; font-size:16px; font-weight:900; display: block;">${item.revenueUSD.toLocaleString()} $</span>
                <span style="color:#2563eb; font-size:13px; font-weight:bold; display: block; margin-top: 2px;">${item.revenueKHR.toLocaleString()} ៛</span>
            </div>` : `<div style="text-align: right; color:#94a3b8; font-weight:bold; font-size:14px;">-</div>`;

        let catBadge = '';
        if (item.category === 'ដុំ និង រាយ') catBadge = `<span style="color: #0ea5e9; font-size: 11px; font-weight: bold; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;">ដុំ + រាយ</span>`;
        else if (item.category === 'បោះដុំ') catBadge = `<span style="color: #7e22ce; font-size: 11px; font-weight: bold; background: #f3e8ff; padding: 2px 6px; border-radius: 4px;">បោះដុំ</span>`;
        else if (item.hasSales) catBadge = `<span style="color: #475569; font-size: 11px; font-weight: bold; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">លក់រាយ</span>`;
        else catBadge = `-`;

        // 🌟 គណនាទំនិញលម្អិតសម្រាប់ Admin ម្នាក់ៗ (បំបែកជា ដប ទាំងអស់ និងចែកតាមតម្លៃ) 🌟
        let detailProductsHTML = '';
        let hasDetailProducts = false;

        if (item.hasSales) {
            // ត្រងយកតែការលក់ដែលមិន CANCELED
            const adminSales = allSales.filter(s => s.createdBy === item.originalAdminId && s.paymentStatus !== 'CANCELED');
            const productSummary = {};
            
            adminSales.forEach(sale => {
                (sale.items || []).forEach(prod => {
                    let priceUsd = Number(prod.price || 0);
                    if (sale.currency === 'KHR' || sale.currency === '៛') priceUsd = priceUsd / 4000;
                    const itemTotalUsd = priceUsd * Number(prod.qty || 0);

                    // 🌟 ពិនិត្យមើលថាវាជា "ឈុត" ឬអត់ 🌟
                    if (prod.isCombo || String(prod.type).includes('ឈុត') || String(prod.name).includes('ឈុត')) {
                        const combo = allCombos.find(c => c.id === prod.id);
                        if (combo && combo.items && combo.items.length > 0) {
                            let totalStandardValue = 0;
                            // គណនាតម្លៃដើមសរុបដើម្បីចែកភាគរយ
                            const subItemsData = combo.items.map(subItem => {
                                const stock = allStocks.find(s => s.id === subItem.productId);
                                const standardPrice = stock ? Number(stock.retailPrice || 0) : 0;
                                const value = standardPrice * Number(subItem.qty || 1);
                                totalStandardValue += value;
                                return { stock, subItemQty: Number(subItem.qty || 1), standardValue: value };
                            });

                            // បំបែកចំណូលទៅឱ្យទំនិញរាយនីមួយៗ
                            subItemsData.forEach(si => {
                                const pName = si.stock ? (si.stock.name || 'មិនស្គាល់') : 'មិនស្គាល់';
                                const proportion = totalStandardValue > 0 ? (si.standardValue / totalStandardValue) : (1 / subItemsData.length);
                                const distributedUsd = itemTotalUsd * proportion;
                                let subQty = si.subItemQty * Number(prod.qty || 0);
                                
                                // រកតម្លៃលក់ចេញក្នុង ១ ដប សម្រាប់ទំនិញនេះ
                                let unitPrice = subQty > 0 ? (distributedUsd / subQty) : 0;
                                const key = `${pName}_${unitPrice.toFixed(4)}`; // បង្កើត Key ជា ឈ្មោះ_តម្លៃ

                                if(!productSummary[key]) productSummary[key] = { name: pName, qty: 0, usd: 0, unitPrice: unitPrice };
                                productSummary[key].qty += subQty;
                                productSummary[key].usd += distributedUsd;
                            });
                        } else {
                            const pName = prod.name || 'មិនស្គាល់';
                            let unitPrice = Number(prod.qty || 0) > 0 ? (itemTotalUsd / Number(prod.qty || 0)) : 0;
                            const key = `${pName}_${unitPrice.toFixed(4)}`;
                            
                            if(!productSummary[key]) productSummary[key] = { name: pName, qty: 0, usd: 0, unitPrice: unitPrice };
                            productSummary[key].qty += Number(prod.qty || 0);
                            productSummary[key].usd += itemTotalUsd;
                        }
                    } else {
                        // 🌟 បើមិនមែនឈុត បំបែកខ្នាតកេះទៅជាដប 🌟
                        const pName = prod.name || 'មិនស្គាល់'; 
                        let isCase = String(prod.unit).toLowerCase() === 'case' || String(prod.unit) === 'កេះ';
                        let calculatedQty = isCase ? (Number(prod.qty) * (Number(prod.itemsPerCase) || 1)) : Number(prod.qty);
                        let unitPrice = calculatedQty > 0 ? (itemTotalUsd / calculatedQty) : 0;
                        
                        const key = `${pName}_${unitPrice.toFixed(4)}`;
                        
                        if(!productSummary[key]) productSummary[key] = { name: pName, qty: 0, usd: 0, unitPrice: unitPrice };
                        productSummary[key].qty += calculatedQty;
                        productSummary[key].usd += itemTotalUsd;
                    }
                });
            });

            // 🌟 តម្រៀបទំនិញ: ឈ្មោះដូចគ្នា ឱ្យនៅជិតគ្នា បន្ទាប់មកតម្រៀបតាមតម្លៃ 🌟
            const sortedProducts = Object.values(productSummary).sort((a, b) => {
                if (a.name === b.name) return b.unitPrice - a.unitPrice; 
                return a.name.localeCompare(b.name); 
            });

            if (sortedProducts.length > 0) {
                hasDetailProducts = true;
                // រៀបចំជា ២ ជួរឈរ (2 Columns) លាតពេញទំហំក្រដាស 🌟
                const gridItems = sortedProducts.map(p => `
                    <div style="width: calc(50% - 15px); display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px dashed #cbd5e1; padding: 8px 0; margin-bottom: 4px;">
                        <div style="flex: 1; padding-right: 10px; color: #1e293b; line-height: 1.4; font-size: 13px; font-weight: bold;">
                            • ${p.name}
                        </div>
                        <div style="font-weight: 800; width: 100px; text-align: right; color: #475569; font-size: 13px;">
                            ${fQ(p.qty)} ដប <span style="font-size:11px; color:#94a3b8; font-weight:bold;">(${fC(p.unitPrice)}$)</span>
                        </div>
                        <div style="font-weight: 900; color: #059669; width: 70px; text-align: right; font-size: 13px;">
                            ${fC(p.usd)} $
                        </div>
                    </div>
                `).join('');

                // បង្កើតជា Sub-row លាតពេញតារាង
                detailProductsHTML = `
                    <tr>
                        <td></td>
                        <td colspan="5" style="padding: 0 15px 20px 15px;">
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px 20px;">
                                <div style="font-size: 12px; color: #64748b; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">បញ្ជីទំនិញលម្អិត (គិតជាដប)</div>
                                <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                                    ${gridItems}
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
            }
        }

        const mainRowBorder = hasDetailProducts ? 'none' : '2px solid #94a3b8';

        return `
            <tbody style="page-break-inside: avoid; border-bottom: 2px solid #94a3b8;">
                <tr style="border-bottom: ${mainRowBorder};">
                    <td style="padding: 16px 10px; text-align: center; vertical-align: top; font-weight: 900; color: #94a3b8; font-size: 14px;">${item.printIndex}</td>
                    <td style="padding: 16px 10px; vertical-align: top;">
                        <p style="font-weight: bold; color: #1e293b; font-size: 16px; margin: 0;">${item.fullName}</p>
                    </td>
                    <td style="padding: 16px 10px; vertical-align: top; text-align: center;">${catBadge}</td>
                    <td style="padding: 16px 10px; vertical-align: top;">${salesHTML}</td>
                    <td style="padding: 16px 10px; text-align: center; vertical-align: top; font-weight: bold; color: #334155; font-size: 15px;">${item.hasSales ? item.totalClients.toLocaleString() + ' នាក់' : '-'}</td>
                    <td style="padding: 16px 10px; vertical-align: top;">${revenueHTML}</td>
                </tr>
                ${detailProductsHTML}
            </tbody>
        `;
    };

    const tableRows = rows.map(renderRow).join('');

    return `
        <table style="width: 100%; text-align: left; border-collapse: collapse; margin-bottom: 40px; font-family: 'Kantumruy Pro', 'Battambang', sans-serif;">
            <thead style="color: #475569; font-size: 14px; font-weight: 900; display: table-header-group; background: #f1f5f9;">
                <tr>
                    <th style="padding: 14px 10px; width: 5%; text-align: center; border-bottom: 2px solid #94a3b8;">#</th>
                    <th style="padding: 14px 10px; width: 25%; border-bottom: 2px solid #94a3b8;">អ្នកគ្រប់គ្រង</th>
                    <th style="padding: 14px 10px; width: 10%; border-bottom: 2px solid #94a3b8; text-align: center;">ប្រភេទ</th>
                    <th style="padding: 14px 10px; width: 30%; border-bottom: 2px solid #94a3b8;">បរិមាណលក់សរុប</th>
                    <th style="padding: 14px 10px; width: 12%; text-align: center; border-bottom: 2px solid #94a3b8;">អតិថិជន</th>
                    <th style="padding: 14px 10px; width: 18%; text-align: right; border-bottom: 2px solid #94a3b8;">ចំណូល</th>
                </tr>
            </thead>
            ${tableRows}
        </table>
    `;
};

const renderProductGrid = (productsArray, unitSettings) => {
    if (!productsArray || productsArray.length === 0) {
        return `<div style="width: 100%; text-align: center; padding: 15px; color: #94a3b8; font-size: 13px; font-weight: bold; border: 1px dashed #cbd5e1; border-radius: 8px;">គ្មានទិន្នន័យ</div>`;
    }
    
    const cards = productsArray.map((p, index) => {
        const unitPrice = p.qty > 0 ? (p.usd / p.qty) : 0;
        const isEven = index % 2 === 0;
        
        return `
        <div style="width: calc(50% - 6px); border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; background: #fff; box-sizing: border-box; margin-bottom: 12px; float: left; margin-right: ${isEven ? '12px' : '0'};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <span style="font-weight: 700; color: #1e293b; font-size: 13px; line-height: 1.4; padding-right: 10px; flex: 1;">📦 ${p.name}</span>
                <span style="font-weight: 900; color: #0f172a; font-size: 14px;">${fC(p.usd)} $</span>
            </div>
            <div style="font-size: 12px; color: #475569; display: flex; justify-content: space-between; border-top: 1px dashed #e2e8f0; padding-top: 6px;">
                <span>អតិថិជន: <span style="font-weight:700; color:#334155;">${fQ(p.clients)}</span> នាក់</span>
                <span>បរិមាណ: <span style="font-weight:900; color:#0ea5e9; font-size:13px;">${fQ(p.qty)} ${translateUnit(p.unit, unitSettings)}</span> <span style="color:#94a3b8; font-weight:bold;">(${fC(unitPrice)}$)</span></span>
            </div>
        </div>
        `;
    }).join('');

    return `<div style="overflow: hidden; width: 100%;">${cards}</div>`;
};

const renderCategoryBlock = (title, dataObj, accentColor, unitSettings) => {
    if (dataObj.products.length === 0) return '';
    return `
        <div style="margin-bottom: 15px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #f1f5f9;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-left: 4px solid ${accentColor}; padding: 0 0 0 10px; margin-bottom: 12px;">
                <span style="font-weight: 900; color: ${accentColor}; font-size: 15px;">${title} <span style="font-size:12px; color:#64748b; margin-left: 8px; font-weight: bold;">(អតិថិជនសរុប: ${fQ(dataObj.clients)} នាក់)</span></span>
                <span style="font-weight: 900; color: #0f172a; font-size: 14px;">សរុបតម្លៃទំនិញសុទ្ធ: <span style="color: ${accentColor};">${fC(dataObj.itemPriceTotalUSD)} $</span></span>
            </div>
            ${renderProductGrid(dataObj.products, unitSettings)}
        </div>
    `;
};

const generateAccountingSectionHTML = (title, data, isGrandTotal = false, expensesList = [], unitSettings = []) => {
    
    let expensesHTML = '';
    let footerSummaryHTML = '';

    if (isGrandTotal) {
        if (expensesList.length > 0) {
            const expRows = expensesList.map((exp, idx) => {
                let expUSD = Number(exp.amount || 0);
                if (exp.currency === 'KHR') expUSD = expUSD / 4000;
                return `
                    <tr>
                        <td style="padding: 8px 10px; border-bottom: 1px solid #fecdd3; font-weight: bold; color: #881337;">${idx + 1}. ${exp.reason}</td>
                        <td style="padding: 8px 10px; border-bottom: 1px solid #fecdd3; text-align: center; color: #9f1239;">${exp.requester}</td>
                        <td style="padding: 8px 10px; border-bottom: 1px solid #fecdd3; text-align: right; font-weight: 900; color: #be123c;">${fC(expUSD)} $</td>
                    </tr>
                `;
            }).join('');

            expensesHTML = `
                <div style="padding: 20px; border-bottom: 2px solid #e2e8f0; background: #fff1f2;">
                    <h4 style="color: #be123c; margin: 0 0 12px 0; font-size: 16px; font-weight: 900;">💸 ការចំណាយទូទៅ (EXPENSES)</h4>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <thead>
                            <tr style="border-bottom: 2px solid #fecdd3;">
                                <th style="padding: 10px; text-align: left; color: #9f1239;">បរិយាយការចំណាយ</th>
                                <th style="padding: 10px; text-align: center; color: #9f1239;">អ្នកស្នើ</th>
                                <th style="padding: 10px; text-align: right; color: #9f1239;">តម្លៃ (USD)</th>
                            </tr>
                        </thead>
                        <tbody>${expRows}</tbody>
                    </table>
                </div>
            `;
        }

        const profitColor = data.summary.netProfit >= 0 ? '#059669' : '#e11d48';
        
        footerSummaryHTML = `
            <div style="background: #f8fafc; padding: 25px 30px; display: flex; flex-direction: column; align-items: flex-end; page-break-inside: avoid;">
                <div style="width: 480px; font-size: 14px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #334155;">
                        <span>ចំណូលសរុប (ទំនិញ PAID):</span>
                        <span style="font-weight: 700;">${fC(data.summary.paidItemsTotal)} $</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #334155;">
                        <span>ចំណូលសរុប (ថ្លៃដឹក PAID):</span>
                        <span style="font-weight: 700;">${fC(data.summary.paidDeliveryTotal)} $</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #059669; font-weight: bold; border-bottom: 1px dashed #cbd5e1; padding-bottom: 12px;">
                        <span>ចំណូលសរុប (ទំនិញ + ថ្លៃដឹក):</span>
                        <span style="font-size: 16px; font-weight: 900;">${fC(data.summary.paidTotal)} $</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #d97706; font-weight: bold;">
                        <span>មិនទាន់ទូទាត់សរុប (ទំនិញ+ថ្លៃដឹក PENDING):</span>
                        <span style="font-size: 15px; font-weight: 900;">- ${fC(data.summary.unpaidTotal)} $</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #be123c; font-weight: bold;">
                        <span>ចំណាយសរុប (Expenses):</span>
                        <span style="font-size: 15px; font-weight: 900;">- ${fC(data.summary.totalExpensesUSD)} $</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px; color: #64748b; font-weight: bold; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px;">
                        <span>សរុបតម្លៃដើម (Total Cost of Goods Sold):</span>
                        <span style="font-size: 15px; font-weight: 900; color: #475569;">- ${fC(data.summary.totalPaidCostUSD)} $</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; color: #0f172a;">
                        <span style="font-weight: 900; text-transform: uppercase;">ប្រាក់ចំណេញសុទ្ធ (NET PROFIT):</span>
                        <span style="font-size: 24px; font-weight: 900; background: #e2e8f0; padding: 4px 12px; border-radius: 8px; color: ${profitColor};">${fC(data.summary.netProfit)} $</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        footerSummaryHTML = `
            <div style="padding: 20px; background: #f8fafc; text-align: right; display: flex; justify-content: flex-end; align-items: center; page-break-inside: avoid; border-top: 1px solid #e2e8f0;">
                <div style="width: 350px; font-size: 13px; text-align: left;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #334155;">
                        <span>ចំណូលទំនិញ (PAID):</span>
                        <span style="font-weight: 700;">${fC(data.summary.paidItemsTotal)} $</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #334155;">
                        <span>ចំណូលថ្លៃដឹក (PAID):</span>
                        <span style="font-weight: 700;">${fC(data.summary.paidDeliveryTotal)} $</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 6px; color: #059669; font-weight: bold; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
                        <span>ចំណូលសរុប (ទូទាត់រួច):</span>
                        <span style="font-size: 16px; font-weight: 900;">${fC(data.summary.paidTotal)} $</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 6px; color: #64748b; font-weight: bold; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
                        <span>តម្លៃដើមសរុប (Cost of Goods Sold):</span>
                        <span style="font-size: 15px; font-weight: 900;">${fC(data.summary.totalPaidCostUSD)} $</span>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div style="margin-bottom: 30px; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden; background: white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); font-family: 'Kantumruy Pro', 'Battambang', sans-serif;">
            
            <div style="background: #1e293b; color: white; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 16px; font-weight: 900;">${title}</span>
                <span style="font-size: 13px; font-weight: bold; background: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 20px;">អតិថិជនសរុប: ${fQ(data.totalClients)} នាក់</span>
            </div>

            <div style="padding: 20px; border-bottom: 2px dashed #e2e8f0; page-break-inside: auto;">
                <h4 style="color: #059669; margin: 0 0 15px 0; font-size: 16px; font-weight: 900;">✅ ទំនិញបានទូទាត់រួច (PAID)</h4>
                
                ${renderCategoryBlock('📦 លក់បោះដុំ (WHOLESALE)', data.paid.wholesale, '#7e22ce', unitSettings)}
                ${renderCategoryBlock('🛍️ លក់រាយ (RETAIL)', data.paid.retail, '#0ea5e9', unitSettings)}
                
                <div style="text-align: right; font-size: 14px; color: #475569; background: #ecfdf5; padding: 10px 16px; border-radius: 8px; display: inline-block; float: right; border: 1px solid #a7f3d0; margin-top: 5px;">
                    ថ្លៃដឹកជញ្ជូនសរុប (Delivery Paid): <span style="color: #059669; font-weight: 900; margin-left: 8px; font-size: 15px;">${fC(data.summary.paidDeliveryTotal)} $</span>
                </div>
                <div style="clear: both;"></div>
            </div>

            <div style="padding: 20px; border-bottom: 2px solid #e2e8f0; background: #fffcf2; page-break-inside: auto;">
                <h4 style="color: #d97706; margin: 0 0 15px 0; font-size: 16px; font-weight: 900;">⏳ មិនទាន់បានទូទាត់ (PENDING)</h4>
                
                ${renderCategoryBlock('📦 លក់បោះដុំ (WHOLESALE)', data.unpaid.wholesale, '#b45309', unitSettings)}
                ${renderCategoryBlock('🛍️ លក់រាយ (RETAIL)', data.unpaid.retail, '#ea580c', unitSettings)}

                <div style="text-align: right; font-size: 14px; color: #92400e; background: #fef3c7; padding: 10px 16px; border-radius: 8px; display: inline-block; float: right; border: 1px solid #fde68a; margin-top: 5px;">
                    ថ្លៃដឹកជញ្ជូនសរុប (Delivery Pending): <span style="color: #d97706; font-weight: 900; margin-left: 8px; font-size: 15px;">${fC(data.summary.unpaidDeliveryTotal)} $</span>
                </div>
                <div style="clear: both;"></div>
            </div>

            ${expensesHTML}
            ${footerSummaryHTML}
        </div>
    `;
};

// ==============================================================
// 🌟 2. EXPORT FUNCTIONS 🌟
// ==============================================================

export const executeNativePrint = async (rowsToPrint, allSales, advancedPrintStats, reportDateLabel, reportAdminLabel, unitSettings) => {
    const { allCombos, allStocks } = await fetchCombosAndStocks();
    const stats = advancedPrintStats;
    
    const contentHTML = 
        generateMainTableHTML(rowsToPrint, allSales, unitSettings, allCombos, allStocks) +
        generateAccountingSectionHTML('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', stats.grand, true, stats.expensesList, unitSettings) +
        generateAccountingSectionHTML('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', stats.pp, false, [], unitSettings) +
        generateAccountingSectionHTML('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', stats.prov, false, [], unitSettings);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
        <head>
            <title>Master_Sales_Report</title>
            <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 portrait; margin: 10mm; }
                body { 
                    font-family: 'Kantumruy Pro', 'Battambang', sans-serif; 
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    margin: 0; padding: 0;
                    background-color: white;
                }
            </style>
        </head>
        <body>
            <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0; font-family: 'Kantumruy Pro', sans-serif;">
                <h1 style="font-size: 22px; font-weight: 900; margin: 0; color: #0f172a;">របាយការណ៍គណនេយ្យលម្អិត</h1>
                <p style="font-size: 13px; color: #64748b; margin: 6px 0 0 0; font-weight: bold;">កាលបរិច្ឆេទ: <span style="color: #334155; font-weight: 900;">${reportDateLabel}</span> &nbsp;|&nbsp; សម្រាប់: <span style="color: #334155; font-weight: 900;">${reportAdminLabel}</span></p>
            </div>
            ${contentHTML}
        </body>
        </html>
    `);
    doc.close();

    iframe.contentWindow.document.fonts.ready.then(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    });
};

export const generatePDF = async (rowsToPrint, allSales, advancedPrintStats, reportDateLabel, reportAdminLabel, adminName, unitSettings, processingState, printStagingRef) => {
    processingState.active = true;
    processingState.message = 'កំពុងបំបែកទិន្នន័យ...';
    processingState.progress = 10;
    
    try {
        const { allCombos, allStocks } = await fetchCombosAndStocks();
        const stats = advancedPrintStats;
        const pdfPagesContent = [];
        
        if (rowsToPrint.length > 0) {
            pdfPagesContent.push(generateMainTableHTML(rowsToPrint, allSales, unitSettings, allCombos, allStocks));
        }

        pdfPagesContent.push(generateAccountingSectionHTML('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', stats.grand, true, stats.expensesList, unitSettings));
        pdfPagesContent.push(generateAccountingSectionHTML('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', stats.pp, false, [], unitSettings));
        pdfPagesContent.push(generateAccountingSectionHTML('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', stats.prov, false, [], unitSettings));

        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = 210; 
        
        for (let i = 0; i < pdfPagesContent.length; i++) {
            processingState.message = `កំពុងថតចម្លងទំព័រទី ${i+1} នៃ ${pdfPagesContent.length}...`;
            
            printStagingRef.innerHTML = `
                <div class="print-page" style="width: 1000px; min-height: 1414px; background: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; font-family: 'Kantumruy Pro', 'Battambang', sans-serif; line-height: 1.6; position: relative;">
                    ${i === 0 ? `
                    <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0;">
                        <h1 style="font-size: 26px; font-weight: 900; margin: 0; color: #0f172a;">របាយការណ៍គណនេយ្យលម្អិត</h1>
                        <p style="font-size: 15px; color: #64748b; margin: 8px 0 0 0; font-weight: bold;">កាលបរិច្ឆេទ: <span style="color: #334155; font-weight: 900;">${reportDateLabel}</span> &nbsp;|&nbsp; សម្រាប់: <span style="color: #334155; font-weight: 900;">${reportAdminLabel}</span></p>
                    </div>` : ''}
                    
                    <div style="flex: 1;">${pdfPagesContent[i]}</div>
                    
                    <div style="position: absolute; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 13px; font-weight: bold; color: #94a3b8; display: flex; justify-content: space-between;">
                        <span>ដោយ: ${adminName}</span>
                        <span>ទំព័រទី ${i+1} នៃ ${pdfPagesContent.length}</span>
                    </div>
                </div>
            `;
            
            await nextTick(); 
            await document.fonts.ready;
            await new Promise(r => setTimeout(r, 600)); 

            const canvas = await html2canvas(printStagingRef.querySelector('.print-page'), { 
                scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff", windowWidth: 1000
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            if (i > 0) pdf.addPage();
            
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            processingState.progress = 10 + Math.round(((i + 1) / pdfPagesContent.length) * 80);
        }

        processingState.message = 'កំពុងរក្សាទុកឯកសារ...';
        processingState.progress = 100;
        pdf.save(`Accounting_Report_${new Date().getTime()}.pdf`);
        
    } catch(e) {
        console.error(e);
        throw e;
    } finally {
        if(printStagingRef) printStagingRef.innerHTML = '';
        processingState.active = false;
    }
};

export const generateExcel = async (rowsToPrint, allSales, advancedPrintStats, reportDateLabel, reportAdminLabel, adminName, unitSettings, processingState) => {
    processingState.active = true;
    processingState.message = 'កំពុងរៀបចំទិន្នន័យ Excel...';
    processingState.progress = 30;

    try {
        const { allCombos, allStocks } = await fetchCombosAndStocks();
        processingState.progress = 50;

        const stats = advancedPrintStats;
        const rows = rowsToPrint;

        const formatUnits = (unitObj) => {
            if (!unitObj) return '';
            return Object.entries(unitObj).map(([u, c]) => `${c} ${translateUnit(u, unitSettings)}`).join(', ');
        };

        // 🌟 គណនាទំនិញលម្អិតក្នុង Excel (2 ជួរឈរ) 🌟
        let mainTableRows = '';
        rows.forEach(item => {
            const hasS = item.hasSales;
            const cat = hasS ? item.category : '-';
            const sStr = hasS ? formatUnits(item.unitCounts) : 'គ្មានការលក់';
            const cStr = hasS ? item.totalClients : '-';
            const rUSD = hasS ? fC(item.revenueUSD) : '-';
            const rKHR = hasS ? fC(item.revenueKHR) : '-';
            
            mainTableRows += `
                <tr>
                    <td style="border: 1px solid #cbd5e1; text-align: center; font-weight: bold; background-color: #f8fafc;">${item.printIndex}</td>
                    <td style="border: 1px solid #cbd5e1; font-weight: bold; font-size: 14px; background-color: #f8fafc;">${item.fullName}</td>
                    <td style="border: 1px solid #cbd5e1; text-align: center; background-color: #f8fafc; font-weight: bold;">អតិថិជន: ${cStr}</td>
                    <td style="border: 1px solid #cbd5e1; text-align: right; color:#059669; font-weight:bold; background-color: #f8fafc;">${rUSD} $</td>
                    <td colspan="3" style="border: 1px solid #cbd5e1; text-align: right; color:#2563eb; font-weight:bold; background-color: #f8fafc;">${rKHR} ៛</td>
                </tr>
            `;

            if (hasS) {
                // ត្រងយកតែការលក់ដែលមិន CANCELED
                const adminSales = allSales.filter(s => s.createdBy === item.originalAdminId && s.paymentStatus !== 'CANCELED');
                const productSummary = {};
                
                adminSales.forEach(sale => {
                    (sale.items || []).forEach(prod => {
                        let priceUsd = Number(prod.price || 0);
                        if (sale.currency === 'KHR' || sale.currency === '៛') priceUsd = priceUsd / 4000;
                        const itemTotalUsd = priceUsd * Number(prod.qty || 0);

                        // 🌟 ពិនិត្យមើលថាវាជា "ឈុត" ឬអត់ 🌟
                        if (prod.isCombo || String(prod.type).includes('ឈុត') || String(prod.name).includes('ឈុត')) {
                            const combo = allCombos.find(c => c.id === prod.id);
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
                                    const pName = si.stock ? (si.stock.name || 'មិនស្គាល់') : 'មិនស្គាល់';
                                    const proportion = totalStandardValue > 0 ? (si.standardValue / totalStandardValue) : (1 / subItemsData.length);
                                    const distributedUsd = itemTotalUsd * proportion;
                                    let subQty = si.subItemQty * Number(prod.qty || 0);
                                    let unitPrice = subQty > 0 ? (distributedUsd / subQty) : 0;
                                    
                                    const key = `${pName}_${unitPrice.toFixed(4)}`;

                                    if(!productSummary[key]) productSummary[key] = { name: pName, qty: 0, usd: 0, unitPrice: unitPrice };
                                    productSummary[key].qty += subQty;
                                    productSummary[key].usd += distributedUsd;
                                });
                            } else {
                                const pName = prod.name || 'មិនស្គាល់';
                                let unitPrice = Number(prod.qty || 0) > 0 ? (itemTotalUsd / Number(prod.qty || 0)) : 0;
                                const key = `${pName}_${unitPrice.toFixed(4)}`;
                                
                                if(!productSummary[key]) productSummary[key] = { name: pName, qty: 0, usd: 0, unitPrice: unitPrice };
                                productSummary[key].qty += Number(prod.qty || 0);
                                productSummary[key].usd += itemTotalUsd;
                            }
                        } else {
                            // 🌟 បើមិនមែនឈុត បំបែកខ្នាតកេះទៅជាដប 🌟
                            const pName = prod.name || 'មិនស្គាល់'; 
                            let isCase = String(prod.unit).toLowerCase() === 'case' || String(prod.unit) === 'កេះ';
                            let calculatedQty = isCase ? (Number(prod.qty) * (Number(prod.itemsPerCase) || 1)) : Number(prod.qty);
                            let unitPrice = calculatedQty > 0 ? (itemTotalUsd / calculatedQty) : 0;
                            
                            const key = `${pName}_${unitPrice.toFixed(4)}`;
                            
                            if(!productSummary[key]) productSummary[key] = { name: pName, qty: 0, usd: 0, unitPrice: unitPrice };
                            productSummary[key].qty += calculatedQty;
                            productSummary[key].usd += itemTotalUsd;
                        }
                    });
                });

                // 🌟 តម្រៀបទំនិញ: ឈ្មោះដូចគ្នា ឱ្យនៅជិតគ្នា បន្ទាប់មកតម្រៀបតាមតម្លៃ 🌟
                const sortedProducts = Object.values(productSummary).sort((a, b) => {
                    if (a.name === b.name) return b.unitPrice - a.unitPrice; 
                    return a.name.localeCompare(b.name); 
                });
                
                // បញ្ចូលជាគូៗ ក្នុង១បន្ទាត់មាន ២ មុខទំនិញ
                for (let i = 0; i < sortedProducts.length; i += 2) {
                    const p1 = sortedProducts[i];
                    const p2 = sortedProducts[i+1];
                    
                    mainTableRows += `<tr>
                        <td style="border: 1px solid #cbd5e1;"></td>
                        <td style="border: 1px solid #cbd5e1; color: #1e293b; font-weight:bold;">• ${p1.name}</td>
                        <td style="border: 1px solid #cbd5e1; text-align: center; color: #475569; font-weight: bold;">${p1.qty} ដប <span style="color:#94a3b8; font-size:11px;">(${fC(p1.unitPrice)}$)</span></td>
                        <td style="border: 1px solid #cbd5e1; text-align: right; color: #0f172a; font-weight: bold;">${fC(p1.usd)} $</td>
                        ${p2 ? `
                            <td style="border: 1px solid #cbd5e1; color: #1e293b; font-weight:bold;">• ${p2.name}</td>
                            <td style="border: 1px solid #cbd5e1; text-align: center; color: #475569; font-weight: bold;">${p2.qty} ដប <span style="color:#94a3b8; font-size:11px;">(${fC(p2.unitPrice)}$)</span></td>
                            <td style="border: 1px solid #cbd5e1; text-align: right; color: #0f172a; font-weight: bold;">${fC(p2.usd)} $</td>
                        ` : `<td colspan="3" style="border: 1px solid #cbd5e1;"></td>`}
                    </tr>`;
                }
            }
        });

        const generateSectionRows = (title, sectionData, showExpenses = false, expensesList = []) => {
            let sectionRows = `
                <tr><td colspan="7"></td></tr>
                <tr><th colspan="7" style="background-color: #1e293b; color: white; font-size: 14pt; text-align: left;">${title}</th></tr>
            `;

            sectionRows += `<tr><th colspan="7" style="background-color: #d1fae5; color: #065f46; text-align: left;">✅ ទំនិញបានទូទាត់រួច (PAID)</th></tr>`;
            
            const addProductRows = (catName, catData) => {
                if(Object.keys(catData.products).length > 0) {
                     sectionRows += `<tr><th colspan="7" style="background-color: #f1f5f9; text-align: left;">${catName} (អតិថិជន: ${catData.clients})</th></tr>`;
                     sectionRows += `<tr><th>ឈ្មោះទំនិញ</th><th>បរិមាណ</th><th colspan="2">អតិថិជន</th><th colspan="3">ចំណូលសរុប (USD)</th></tr>`;
                     catData.products.forEach(p => {
                         sectionRows += `<tr>
                            <td style="border: 1px solid #cbd5e1;">${p.name}</td>
                            <td style="border: 1px solid #cbd5e1; text-align: center;">${p.qty} ${translateUnit(p.unit, unitSettings)}</td>
                            <td colspan="2" style="border: 1px solid #cbd5e1; text-align: center;">${p.clients}</td>
                            <td colspan="3" style="border: 1px solid #cbd5e1; text-align: right; color:#1e293b; font-weight:bold;">${fC(p.usd)}</td>
                         </tr>`;
                     });
                     sectionRows += `<tr><td colspan="4" style="text-align: right; font-weight:bold; background-color:#f8fafc;">សរុប ${catName}:</td><td colspan="3" style="text-align: right; font-weight:bold; background-color:#f8fafc; color:#059669;">${fC(catData.itemPriceTotalUSD)}</td></tr>`;
                }
            };
            addProductRows('លក់បោះដុំ (Wholesale)', sectionData.paid.wholesale);
            addProductRows('លក់រាយ (Retail)', sectionData.paid.retail);
            sectionRows += `<tr><td colspan="4" style="text-align: right; font-weight:bold; background-color:#ecfdf5;">ថ្លៃដឹកជញ្ជូនសរុប (Delivery Paid):</td><td colspan="3" style="text-align: right; font-weight:bold; background-color:#ecfdf5; color:#059669;">${fC(sectionData.paid.deliveryFeeUSD)}</td></tr>`;

            sectionRows += `<tr><th colspan="7" style="background-color: #fef3c7; color: #92400e; text-align: left;">⏳ មិនទាន់បានទូទាត់ (PENDING)</th></tr>`;
            addProductRows('លក់បោះដុំ (Wholesale)', sectionData.unpaid.wholesale);
            addProductRows('លក់រាយ (Retail)', sectionData.unpaid.retail);
            sectionRows += `<tr><td colspan="4" style="text-align: right; font-weight:bold; background-color:#fffbeb;">ថ្លៃដឹកជញ្ជូនសរុប (Delivery Pending):</td><td colspan="3" style="text-align: right; font-weight:bold; background-color:#fffbeb; color:#d97706;">${fC(sectionData.unpaid.deliveryFeeUSD)}</td></tr>`;

            if (showExpenses && expensesList.length > 0) {
                 sectionRows += `<tr><th colspan="7" style="background-color: #ffe4e6; color: #9f1239; text-align: left;">💸 ការចំណាយទូទៅ (EXPENSES)</th></tr>`;
                 sectionRows += `<tr><th colspan="4">បរិយាយ</th><th>អ្នកស្នើ</th><th colspan="2">តម្លៃ (USD)</th></tr>`;
                 expensesList.forEach(exp => {
                     let eUSD = exp.currency==='KHR' ? exp.amount/4000 : exp.amount;
                     sectionRows += `<tr>
                        <td colspan="4" style="border: 1px solid #cbd5e1;">${exp.reason}</td>
                        <td style="border: 1px solid #cbd5e1; text-align: center;">${exp.requester}</td>
                        <td colspan="2" style="border: 1px solid #cbd5e1; text-align: right; color:#e11d48; font-weight:bold;">${fC(eUSD)}</td>
                     </tr>`;
                 });
                 sectionRows += `<tr><td colspan="5" style="text-align: right; font-weight:bold; background-color:#fff1f2;">សរុបចំណាយ:</td><td colspan="2" style="text-align: right; font-weight:bold; background-color:#fff1f2; color:#be123c;">${fC(sectionData.summary.totalExpensesUSD)}</td></tr>`;
            }

            sectionRows += `
                <tr><td colspan="7"></td></tr>
                <tr><th colspan="5" style="text-align: right; background-color:#f8fafc;">ចំណូលសរុប (ទូទាត់រួច PAID):</th><td colspan="2" style="text-align: right; font-weight:bold; background-color:#f8fafc; color:#059669;">${fC(sectionData.summary.paidTotal)}</td></tr>
                <tr><th colspan="5" style="text-align: right; background-color:#f8fafc;">មិនទាន់ទូទាត់ (PENDING):</th><td colspan="2" style="text-align: right; font-weight:bold; background-color:#f8fafc; color:#d97706;">${fC(sectionData.summary.unpaidTotal)}</td></tr>
            `;
            if (showExpenses) {
                sectionRows += `
                    <tr><th colspan="5" style="text-align: right; background-color:#f8fafc;">ចំណាយសរុប (Expenses):</th><td colspan="2" style="text-align: right; font-weight:bold; background-color:#f8fafc; color:#be123c;">- ${fC(sectionData.summary.totalExpensesUSD)}</td></tr>
                    <tr><th colspan="5" style="text-align: right; background-color:#f8fafc;">តម្លៃដើមទំនិញ (COGS):</th><td colspan="2" style="text-align: right; font-weight:bold; background-color:#f8fafc; color:#475569;">- ${fC(sectionData.summary.totalPaidCostUSD)}</td></tr>
                    <tr><th colspan="5" style="text-align: right; background-color:#e0e7ff; font-size:14pt;">ប្រាក់ចំណេញសុទ្ធ (NET PROFIT):</th><td colspan="2" style="text-align: right; font-weight:bold; background-color:#e0e7ff; font-size:14pt; color:${sectionData.summary.netProfit>=0?'#059669':'#e11d48'};">${fC(sectionData.summary.netProfit)}</td></tr>
                `;
            } else {
                 sectionRows += `<tr><th colspan="5" style="text-align: right; background-color:#f8fafc;">តម្លៃដើមទំនិញ (COGS):</th><td colspan="2" style="text-align: right; font-weight:bold; background-color:#f8fafc; color:#475569;">${fC(sectionData.summary.totalPaidCostUSD)}</td></tr>`;
            }

            return sectionRows;
        };

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
                    <tr><th colspan="7" style="font-size:18pt; text-align:center; background-color:#f1f5f9; height:40px;">របាយការណ៍គណនេយ្យលម្អិត</th></tr>
                    <tr><th colspan="7" style="font-size:12pt; text-align:center; background-color:#f1f5f9; font-weight:normal;">កាលបរិច្ឆេទ: ${reportDateLabel} | សម្រាប់: ${reportAdminLabel}</th></tr>
                    <tr><td colspan="7"></td></tr>
                    
                    <tr><th colspan="7" style="background-color: #1e293b; color: white; font-size: 12pt; text-align: left;">បញ្ជីអ្នកគ្រប់គ្រង (Admin Performance)</th></tr>
                    <tr style="background-color: #f8fafc;">
                        <th>#</th><th>អ្នកគ្រប់គ្រង / ទំនិញ</th><th>អតិថិជន / បរិមាណ</th><th>ចំណូល (USD)</th><th>ទំនិញទី២</th><th>បរិមាណទី២</th><th>ចំណូលទី២ (USD)</th>
                    </tr>
                    ${mainTableRows}

                    ${generateSectionRows('📊 ទិន្នន័យរួមសរុប (រាជធានីភ្នំពេញ + ខេត្ត)', stats.grand, true, stats.expensesList)}
                    ${generateSectionRows('🏙️ ទិន្នន័យរាជធានីភ្នំពេញ (Phnom Penh)', stats.pp)}
                    ${generateSectionRows('🛣️ ទិន្នន័យតាមបណ្តាខេត្ត (Provinces)', stats.prov)}
                    
                    <tr><td colspan="7"></td></tr>
                    <tr><td colspan="7" style="text-align: right; color: #64748b;">ទាញយកដោយ: ${adminName} | ${new Date().toLocaleString('km-KH')}</td></tr>
                </table>
            </body>
            </html>
        `;

        processingState.progress = 100;
        processingState.message = 'រួចរាល់!';

        const blob = new Blob(['\ufeff', excelHTML], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Accounting_Report_${new Date().getTime()}.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
    } catch(e) {
        console.error(e);
        throw e;
    } finally {
        setTimeout(() => { processingState.active = false; }, 500);
    }
};