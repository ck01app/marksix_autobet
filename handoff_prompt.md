\# Project Handoff: HKJC Mark Six Auto-Bet Chrome Extension



\## 1. 專案背景與定位

這是一個專為「香港賽馬會 (HKJC) 六合彩」網頁開發的 Chrome Extension (Manifest V3) 輔助工具。它的核心功能是讓使用者將從 Excel 複製出來、以 Tab (製表符) 分隔的號碼文字檔 (.txt / .csv) 直接上傳，並在馬會投注網頁上執行全自動的點擊選號與分批提交。項目定位為【完全開源 (Open-Source)】，以建立使用者的絕對隱私信任（所有數據 100% 在本地處理，絕不上傳伺服器）。



\## 2. 目前已實現的架構與功能

項目已移除了獨立的 Popup 介面，改為全自動偵測馬會六合彩專屬頁面並直接在網頁畫面上注入懸浮控制盒（純 Content Script 注入，繞過了馬會嚴格的 CSP 安全政策與分頁通訊限制）。

\- \*\*manifest.json\*\*：精準配置了專屬六合彩頁面的注入權限，設定為 `document\_start` 與 `all\_frames: true` 確保強制注入。

\- \*\*content.js\*\*：

&#x20; - 自動在馬會網頁右上角畫出一個精美的懸浮綠色控制盒（UI）。

&#x20; - 支援【滑鼠隨意拖拽移動 (Draggable)】功能，防止擋住投注區。

&#x20; - 右上角自帶紅色的【「×」手動關閉/銷毀按鈕】。

&#x20; - 使用【萬能空白分割法】精準解析 Excel 複製出來的 Tab 分隔數據，過濾 1-49 有效號碼。

&#x20; - 完美沿用經測試完全正確的 Python Selenium 行列算式 XPath。

&#x20; - 具備防呆機制：每 60 個號碼（10注）或最後一注，會自動觸發分批提交序列（添加到投注區 -> 發送注項 -> 確定投注），並在每次點擊與提交間設有非同步延遲（sleep/waitForElement）。

&#x20; - 增加了針對 `e.target.files` 取消選取時的類型防禦（避免 Blob 報錯）。



\---



\## 3. 核心原始碼回顧 (現行工作版本)



\### 【manifest.json】

```json

{

&#x20; "manifest\_version": 3,

&#x20; "name": "六合彩 CSV 自動投注助手",

&#x20; "version": "1.7",

&#x20; "description": "直接在網頁右上方注入控制盒，全自動快速填寫馬會六合彩注項。",

&#x20; "permissions": \["activeTab", "scripting"],

&#x20; "host\_permissions": \[

&#x20;   "https://bet.hkjc.com/ch/marksix/\*",

&#x20;   "https://bet.hkjc.com/en/marksix/\*"

&#x20; ],

&#x20; "icons": {

&#x20;   "16": "icon16.png",

&#x20;   "48": "icon48.png",

&#x20;   "128": "icon128.png"

&#x20; },

&#x20; "content\_scripts": \[

&#x20;   {

&#x20;     "matches": \[

&#x20;       "https://bet.hkjc.com/ch/marksix/\*",

&#x20;       "https://bet.hkjc.com/en/marksix/\*"

&#x20;     ],

&#x20;     "js": \["content.js"],

&#x20;     "run\_at": "document\_start",

&#x20;     "all\_frames": true

&#x20;   }

&#x20; ]

}

```



\### 【content.js】

```javascript

(function() {

&#x20; 'use strict';

&#x20; function initHelper() {

&#x20;   if (!document.body || document.getElementById('helper-file-input')) return;

&#x20;   try {

&#x20;     const helperBox = document.createElement('div');

&#x20;     helperBox.id = 'hkjc-helper-box-container';

&#x20;     helperBox.style = "position:fixed;top:120px;right:20px;z-index:9999999;padding:15px;background:#fff;border:3px solid #28a745;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.3);width:260px;font-family:Arial,sans-serif;transition:opacity 0.3s;cursor:move;";

&#x20;     helperBox.innerHTML = `

&#x20;       <button id="helper-close-btn" style="position:absolute;top:10px;right:10px;background:none;border:none;color:#dc3545;font-size:20px;font-weight:bold;cursor:pointer;padding:0 5px;line-height:1;z-index:10;">×</button>

&#x20;       <h4 id="helper-title" style="margin:0 0 10px 0;color:#333;font-size:16px;font-weight:bold;padding-right:20px;user-select:none;">六合彩自動投注快線</h4>

&#x20;       <p style="font-size:12px;color:#666;margin-bottom:10px;user-select:none;">請先手動登入馬會帳戶，然後選擇檔案。</p>

&#x20;       <input type="file" id="helper-file-input" accept=".csv,.txt" style="width:100%;margin-bottom:10px;cursor:default;" />

&#x20;       <button id="helper-start-btn" disabled style="width:100%;padding:8px;background:#28a745;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold;font-size:14px;">開始自動選號</button>

&#x20;       <div id="helper-status" style="margin-top:10px;font-size:12px;font-weight:bold;color:#666;user-select:none;">等待上傳 Excel 複製的文字檔...</div>

&#x20;     `;

&#x20;     document.body.appendChild(helperBox);



&#x20;     const fileInput = document.getElementById('helper-file-input');

&#x20;     const startBtn = document.getElementById('helper-start-btn');

&#x20;     const statusDiv = document.getElementById('helper-status');

&#x20;     const closeBtn = document.getElementById('helper-close-btn');

&#x20;     let parsedNumbers = \[];

&#x20;     const sleep = ms => new Promise(r => setTimeout(r, ms));

&#x20;     const waitForElement = (xp, t=10000) => new Promise((res,rej)=>{

&#x20;       const start = Date.now();

&#x20;       const timer = setInterval(()=>{

&#x20;         const el = document.evaluate(xp, document, null, XPathResult.FIRST\_ORDERED\_NODE\_TYPE, null).singleNodeValue;

&#x20;         if(el) { clearInterval(timer); res(el); }

&#x20;         else if(Date.now()-start>t) { clearInterval(timer); rej(new Error('Timeout')); }

&#x20;       },200);

&#x20;     });



&#x20;     // 拖拽邏輯

&#x20;     let isDragging = false, offsetX = 0, offsetY = 0;

&#x20;     helperBox.addEventListener('mousedown', (e) => {

&#x20;       if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;

&#x20;       isDragging = true; offsetX = e.clientX - helperBox.offsetLeft; offsetY = e.clientY - helperBox.offsetTop;

&#x20;       helperBox.style.transition = "none";

&#x20;     });

&#x20;     document.addEventListener('mousemove', (e) => {

&#x20;       if (!isDragging) return;

&#x20;       helperBox.style.right = 'auto'; helperBox.style.left = (e.clientX - offsetX) + 'px'; helperBox.style.top = (e.clientY - offsetY) + 'px';

&#x20;     });

&#x20;     document.addEventListener('mouseup', () => { isDragging = false; helperBox.style.transition = "opacity 0.3s"; });

&#x20;     closeBtn.addEventListener('click', () => { helperBox.style.opacity = "0"; setTimeout(() => helperBox.remove(), 300); });



&#x20;     // 檔案讀取

&#x20;     fileInput.addEventListener('change', (e) => {

&#x20;       const file = e.target.files\[0]; if (!file) return;

&#x20;       const reader = new FileReader();

&#x20;       reader.onload = function(evt) {

&#x20;         parsedNumbers = evt.target.result.split(/\[\\s,]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n) \&\& n >= 1 \&\& n <= 49);

&#x20;         if (parsedNumbers.length > 0) {

&#x20;           statusDiv.style.color = '#28a745'; statusDiv.innerText = `成功載入 ${parsedNumbers.length} 個號碼 (${Math.ceil(parsedNumbers.length / 6)} 注)`;

&#x20;           startBtn.disabled = false;

&#x20;         } else {

&#x20;           statusDiv.style.color = '#dc3545'; statusDiv.innerText = "無法解析號碼！"; startBtn.disabled = true;

&#x20;         }

&#x20;       };

&#x20;       reader.readAsText(file);

&#x20;     });



&#x20;     // 自動選號點擊邏輯

&#x20;     startBtn.addEventListener('click', async () => {

&#x20;       startBtn.disabled = true; fileInput.disabled = true; statusDiv.style.color = '#007bff';

&#x20;       for (let i = 0; i < parsedNumbers.length; i++) {

&#x20;         const n = parsedNumbers\[i], row = Math.floor((n-1)/10)+1, col = ((n-1)%10)+1;

&#x20;         const ballXpath = `//\*\[@id="ball-panel-table"]/div\[${row}]/div\[${col}]/div`;

&#x20;         statusDiv.innerText = `正在點擊號碼: ${n} (${i+1}/${parsedNumbers.length})`;

&#x20;         try {

&#x20;           const ball = document.evaluate(ballXpath, document, null, XPathResult.FIRST\_ORDERED\_NODE\_TYPE, null).singleNodeValue;

&#x20;           if (ball) ball.click();

&#x20;         } catch (e) {}



&#x20;         if (((i + 1) >= 60 \&\& (i + 1) % 60 === 0) || (i + 1) === parsedNumbers.length) {

&#x20;           try {

&#x20;             statusDiv.innerText = "正在處理：添加到投注區...";

&#x20;             (await waitForElement('//\*\[@id="Add\_to\_Slip"]')).click(); await sleep(1000);

&#x20;             statusDiv.innerText = "正在處理：發送注項...";

&#x20;             (await waitForElement('//\*\[@data-testid="bet\_placeBet\_button"]')).click(); await sleep(2000);

&#x20;             statusDiv.innerText = "正在處理：確定投注...";

&#x20;             (await waitForElement('//button\[starts-with(text(), "確定")]')).click(); await sleep(2000);

&#x20;           } catch (err) {

&#x20;             statusDiv.style.color = '#dc3545'; statusDiv.innerText = "自動化流程中斷，請檢查網頁狀態。"; break;

&#x20;           }

&#x20;         }

&#x20;         await sleep(150);

&#x20;       }

&#x20;       statusDiv.style.color = '#28a745'; statusDiv.innerText = "所有注項已全數自動化投注完畢！";

&#x20;       startBtn.disabled = false; fileInput.disabled = false;

&#x20;     });

&#x20;   } catch (err) {}

&#x20; }

&#x20; if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initHelper); else initHelper();

})();

```



\---



\## 4. 接下來待完成的優化任務 (Outstanding Tasks)



請基於上述現有的工作版本代碼，\*\*逐步引導我完成以下優化任務\*\*。我們現在先從【任務 1：多語言支持（Multi-language）】開始著手：



\### 🌐 任務 1：雙語支持 (Bilingual Support - HK \& EN)

\- 自動偵測馬會網頁當前的語系（透過判斷 URL 是包含 `/ch/` 還是 `/en/`）。

\- 移除對簡體中文（CN）的需求，因為馬會官方僅提供繁體中文與英文。

\- 控制盒內的所有 UI 文字（標題、提示、按鈕、狀態字樣）需根據語系自動切換為：繁體中文 (香港) 或 英文 (EN)。



\### 🛡️ 任務 2：更強大的錯誤處理與重新啟動程序 (Error Handling \& Restart)

\- 如果遇到馬會網頁逾時、資金不足或某個按鈕（如「確定」）點擊超時，腳本不能直接死當。

\- 需要加入防呆重試機制，並在控制盒上即時更新錯誤提示。

\- 提供一個【重置/重新啟動 (Reset/Restart)】按鈕，讓使用者不用重新整理整個網頁就能清空狀態、重新上傳新檔案進行第二次投注。



\### 📦 任務 3：準備發佈至 Chrome 線上應用程式商店 (Chrome Store Publication)

\- 協助優化 `manifest.json`，精確縮減 `host\_permissions` 權限範圍至馬會六合彩特定路徑以加快 Google 的自動化審查。

\- 撰寫應對 Google 商店審查時所需的官方英文「單一用途說明 (Single Purpose)」、「權限合理性原因 (Justification)」以及「本地隱私實務聲明 (Privacy Practices)」。

\- 整理在 GitHub 上發佈開源發行版「一鍵安裝 ZIP 包 (Release)」的標準打包流程。



\### 📄 任務 4：完善開源文檔與使用指南 (Documentation)

\- 撰寫包含中英文對照的 `README.md` 開源專案說明書。

\- 提供一份標準格式的 Excel / CSV 測試範例數據，供使用者下載或複製進行首航測試。



\---



\*\*請回覆我：你已完全理解本項目的現狀與代碼結構。讓我們立刻開始【任務 1：雙語支持】的代碼重構，請為我編寫最新的 `content.js` 實現方式！\*\*



