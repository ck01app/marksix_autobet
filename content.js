(function() {
  'use strict';

  // 1. 雙語字典檔設定 (保留你的最新標籤與錯誤提示擴充)
  const i18n = {
    'zh-HK': {
      title: '六合彩自動投注助手',
      subtitle: '請先手動登入馬會帳戶，然後選擇檔案。',
      startBtn: '開始自動選號',
      startBtnRunning: '正在自動投注...',
      resetBtn: '重置 / 重新啟動',
      statusWaiting: '等待上傳 CSV 檔...',
      statusLoaded: (count, bets) => `成功載入 ${count} 個號碼 (${bets} 注)`,
      statusParseError: '無法解析號碼！',
      statusRunning: (n, i, total) => `正在點擊號碼: ${n} (${i}/${total})`,
      stepAdd: '正在處理：添加到投注區...',
      stepPlace: '正在處理：發送注項...',
      stepConfirm: '正在處理：確定投注...',
      errorTimeout: (stepName) => `錯誤：找不到網頁元素 [${stepName}]，逾時未回應！`,
      errorInterrupt: '自動化流程中斷，請檢查網頁狀態。',
      successDone: '所有注項已全數自動化投注完畢！',
      confirmText: '確定'
    },
    'en': {
      title: 'Mark Six Auto-Bet Helper',
      subtitle: 'Please log in to HKJC first, then select file.',
      startBtn: 'Start Auto-Betting',
      startBtnRunning: 'Auto-Betting...',
      resetBtn: 'Reset / Restart',
      statusWaiting: 'Waiting for CSV file...',
      statusLoaded: (count, bets) => `Loaded ${count} numbers (${bets} bets)`,
      statusParseError: 'Failed to parse numbers!',
      statusRunning: (n, i, total) => `Clicking number: ${n} (${i}/${total})`,
      stepAdd: 'Processing: Add to bet slip...',
      stepPlace: 'Processing: Place bet...',
      stepConfirm: 'Processing: Confirm bet...',
      errorTimeout: (stepName) => `Error: XPath element not found [${stepName}] (Timeout)!`,
      errorInterrupt: 'Automation interrupted, please check page.',
      successDone: 'All bets have been successfully placed!',
      confirmText: 'Confirm'
    }
  };

  // 2. 自動偵測當前網頁語系 (精確對應 /en/ 與 /ch/)
  function detectLang() {
    const path = window.location.pathname;
    if (path.includes('/en/')) return 'en';
    return 'zh-HK'; // 預設及 /ch/ 路徑均為繁體中文
  }

  function initHelper() {
    if (!document.body || document.getElementById('helper-file-input')) return;
    
    const currentLang = detectLang();
    const t = i18n[currentLang];

    try {
      const helperBox = document.createElement('div');
      helperBox.id = 'hkjc-helper-box-container';
      // 保留你自訂的初始位置 top:30px; right:360px
      helperBox.style = "position:fixed;top:30px;right:360px;z-index:9999999;padding:15px;background:#fff;border:3px solid #28a745;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.3);width:260px;font-family:Arial,sans-serif;transition:opacity 0.3s;cursor:move;";
      helperBox.innerHTML = `
        <button id="helper-close-btn" style="position:absolute;top:10px;right:10px;background:none;border:none;color:#dc3545;font-size:20px;font-weight:bold;cursor:pointer;padding:0 5px;line-height:1;z-index:10;">×</button>
        <h4 id="helper-title" style="margin:0 0 10px 0;color:#333;font-size:16px;font-weight:bold;padding-right:20px;user-select:none;">${t.title}</h4>
        <p style="font-size:12px;color:#666;margin-bottom:10px;user-select:none;">${t.subtitle}</p>
        <input type="file" id="helper-file-input" accept=".csv,.txt" style="width:100%;margin-bottom:10px;cursor:default;" />
        <button id="helper-start-btn" disabled style="width:100%;padding:8px;background:#28a745;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold;font-size:14px;margin-bottom:6px;">${t.startBtn}</button>
        <button id="helper-reset-btn" style="width:100%;padding:6px;background:#6c757d;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold;font-size:12px;display:none;">${t.resetBtn}</button>
        <div id="helper-status" style="margin-top:10px;font-size:12px;font-weight:bold;color:#666;user-select:none;">${t.statusWaiting}</div>
      `;
      document.body.appendChild(helperBox);

      const fileInput = document.getElementById('helper-file-input');
      const startBtn = document.getElementById('helper-start-btn');
      const resetBtn = document.getElementById('helper-reset-btn');
      const statusDiv = document.getElementById('helper-status');
      const closeBtn = document.getElementById('helper-close-btn');
      let parsedNumbers = [];

      const sleep = ms => new Promise(r => setTimeout(r, ms));
      
      // 強化版 waitForElement：帶入標籤名稱，逾時即回傳具體錯誤
      const waitForElement = (xp, labelName, t_ms=10000) => new Promise((res,rej)=>{
        const start = Date.now();
        const timer = setInterval(()=>{
          const el = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if(el) { clearInterval(timer); res(el); }
          else if(Date.now()-start>t_ms) { clearInterval(timer); rej(new Error(t.errorTimeout(labelName))); }
        },200);
      });

      // 拖拽邏輯
      let isDragging = false, offsetX = 0, offsetY = 0;
      helperBox.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
        isDragging = true; offsetX = e.clientX - helperBox.offsetLeft; offsetY = e.clientY - helperBox.offsetTop;
        helperBox.style.transition = "none";
      });
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        helperBox.style.right = 'auto'; helperBox.style.left = (e.clientX - offsetX) + 'px'; helperBox.style.top = (e.clientY - offsetY) + 'px';
      });
      document.addEventListener('mouseup', () => { isDragging = false; helperBox.style.transition = "opacity 0.3s"; });
      closeBtn.addEventListener('click', () => { helperBox.style.opacity = "0"; setTimeout(() => helperBox.remove(), 300); });

      // 重置 / 重新啟動邏輯
      function resetHelperState() {
        fileInput.value = '';
        fileInput.disabled = false;
        parsedNumbers = [];
        startBtn.disabled = true;
        startBtn.innerText = t.startBtn;
        startBtn.style.display = 'block';
        resetBtn.style.display = 'none';
        statusDiv.style.color = '#666';
        statusDiv.innerText = t.statusWaiting;
      }

      resetBtn.addEventListener('click', resetHelperState);

      // 檔案讀取
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
          parsedNumbers = evt.target.result.split(/[\s,]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= 49);
          if (parsedNumbers.length > 0) {
            statusDiv.style.color = '#28a745'; 
            statusDiv.innerText = t.statusLoaded(parsedNumbers.length, Math.ceil(parsedNumbers.length / 6));
            startBtn.disabled = false;
          } else {
            statusDiv.style.color = '#dc3545'; 
            statusDiv.innerText = t.statusParseError; 
            startBtn.disabled = true;
          }
        };
        reader.readAsText(file);
      });

      // 自動選號點擊與錯誤處理邏輯
      startBtn.addEventListener('click', async () => {
        startBtn.disabled = true; 
        fileInput.disabled = true; 
        statusDiv.style.color = '#007bff';
        startBtn.innerText = t.startBtnRunning;

        try {
          for (let i = 0; i < parsedNumbers.length; i++) {
            const n = parsedNumbers[i], row = Math.floor((n-1)/10)+1, col = ((n-1)%10)+1;
            const ballXpath = `//*[@id="ball-panel-table"]/div[${row}]/div[${col}]/div`;
            statusDiv.innerText = t.statusRunning(n, i+1, parsedNumbers.length);
            
            try {
              const ball = document.evaluate(ballXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
              if (ball) ball.click();
            } catch (e) {}

            // 每 60 個號碼 (10注) 或最後一注時執行分批提交
            if (((i + 1) >= 60 && (i + 1) % 60 === 0) || (i + 1) === parsedNumbers.length) {
              statusDiv.innerText = t.stepAdd;
              (await waitForElement('//*[@id="Add_to_Slip"]', 'Add_to_Slip')).click(); 
              await sleep(1000);

              statusDiv.innerText = t.stepPlace;
              (await waitForElement('//*[@data-testid="bet_placeBet_button"]', 'bet_placeBet_button')).click(); 
              await sleep(2000);

              statusDiv.innerText = t.stepConfirm;
              (await waitForElement(`//button[starts-with(text(), "${t.confirmText}")]`, 'Confirm_Button')).click(); 
              await sleep(2000);
            }
            await sleep(150);
          }

          // 順利完成
          statusDiv.style.color = '#28a745'; 
          statusDiv.innerText = t.successDone;
          startBtn.style.display = 'none';
          resetBtn.style.display = 'block';
          fileInput.disabled = false;

        } catch (err) {
          // 捕捉逾時或找不到元素的錯誤，切換顯示重置按鈕
          statusDiv.style.color = '#dc3545';
          statusDiv.innerText = err.message || t.errorInterrupt;
          startBtn.style.display = 'none';
          resetBtn.style.display = 'block';
          fileInput.disabled = false;
        }
      });
    } catch (err) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initHelper); else initHelper();
})();