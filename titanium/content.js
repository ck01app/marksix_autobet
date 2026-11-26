(function() {
  'use strict';

  if (typeof window.__toggleMarkSixMobileHelper === 'function') {
    return;
  }

  const i18n = {
    'zh-HK': {
      title: '六合彩自動投注助手 (Titanium)',
      subtitle: '請先手動登入馬會帳戶，然後選擇檔案。',
      startBtn: '開始自動選號',
      startBtnRunning: '正在自動投注...',
      resetBtn: '重置 / 重新啟動',
      statusWaiting: '等待上傳 CSV / TXT 檔...',
      statusLoaded: (count, bets) => `成功載入 ${count} 個號碼 (${bets} 注)`,
      statusParseError: '無法解析號碼！',
      statusRunning: (n, i, total) => `正在點擊號碼: ${n} (${i}/${total})`,
      stepAdd: '正在處理：加入注項...',
      stepOpenSlip: '正在處理：開啟投注區...',
      stepPlace: '正在處理：發送注項...',
      stepConfirm: '正在處理：確定投注...',
      stepFinish: '正在處理：完成注項...',
      stepCloseSlip: '正在處理：返回選號畫面...',
      errorTimeout: (stepName) => `錯誤：找不到網頁元素 [${stepName}]，逾時未回應！`,
      errorInterrupt: '自動化流程中斷，請檢查網頁狀態。',
      successDone: '所有注項已全數自動化投注完畢！',
      confirmText: '確定'
    },
    'en': {
      title: 'Mark Six Auto-Bet Helper (Titanium)',
      subtitle: 'Please log in to HKJC first, then select file.',
      startBtn: 'Start Auto-Betting',
      startBtnRunning: 'Auto-Betting...',
      resetBtn: 'Reset / Restart',
      statusWaiting: 'Waiting for CSV / TXT file...',
      statusLoaded: (count, bets) => `Loaded ${count} numbers (${bets} bets)`,
      statusParseError: 'Failed to parse numbers!',
      statusRunning: (n, i, total) => `Clicking number: ${n} (${i}/${total})`,
      stepAdd: 'Processing: Add to betslip...',
      stepOpenSlip: 'Processing: Open betslip...',
      stepPlace: 'Processing: Place bet...',
      stepConfirm: 'Processing: Confirm bet...',
      stepFinish: 'Processing: Finish...',
      stepCloseSlip: 'Processing: Return to numbers...',
      errorTimeout: (stepName) => `Error: Element not found [${stepName}] (Timeout)!`,
      errorInterrupt: 'Automation interrupted, please check page.',
      successDone: 'All bets have been successfully placed!',
      confirmText: 'Confirm'
    }
  };

  function detectLang() {
    return window.location.pathname.includes('/en/') ? 'en' : 'zh-HK';
  }

  function createMobileHelperBox() {
    if (!document.body || document.getElementById('hkjc-mobile-helper-container')) return;

    const t = i18n[detectLang()];

    const helperBox = document.createElement('div');
    helperBox.id = 'hkjc-mobile-helper-container';
    helperBox.style = [
      'position:fixed',
      'top:14px',
      'left:14px',
      'right:14px',
      'z-index:9999999',
      'padding:12px',
      'background:#fff',
      'border:3px solid #28a745',
      'border-radius:8px',
      'box-shadow:0 4px 15px rgba(0,0,0,0.3)',
      'width:auto',
      'max-width:340px',
      'margin:0 auto',
      'font-family:Arial,sans-serif',
      'transition:opacity 0.3s'
    ].join(';');

    helperBox.innerHTML = `
      <button id="m-helper-close-btn" style="position:absolute;top:8px;right:10px;background:none;border:none;color:#dc3545;font-size:22px;font-weight:bold;cursor:pointer;padding:0 6px;line-height:1;z-index:10;">×</button>
      <h4 id="m-helper-title" style="margin:0 0 6px 0;color:#333;font-size:15px;font-weight:bold;padding-right:24px;user-select:none;">${t.title}</h4>
      <p style="font-size:12px;color:#666;margin:0 0 8px 0;user-select:none;">${t.subtitle}</p>
      <input type="file" id="m-helper-file-input" accept=".csv,.txt,text/csv,text/plain,*/*" style="width:100%;margin-bottom:8px;font-size:13px;" />
      <button id="m-helper-start-btn" disabled style="width:100%;padding:9px;background:#28a745;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold;font-size:14px;margin-bottom:6px;">${t.startBtn}</button>
      <button id="m-helper-reset-btn" style="width:100%;padding:7px;background:#6c757d;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold;font-size:12px;display:none;">${t.resetBtn}</button>
      <div id="m-helper-status" style="margin-top:8px;font-size:12px;font-weight:bold;color:#666;user-select:none;">${t.statusWaiting}</div>
    `;
    document.body.appendChild(helperBox);

    const fileInput = document.getElementById('m-helper-file-input');
    const startBtn = document.getElementById('m-helper-start-btn');
    const resetBtn = document.getElementById('m-helper-reset-btn');
    const statusDiv = document.getElementById('m-helper-status');
    const closeBtn = document.getElementById('m-helper-close-btn');
    let parsedNumbers = [];

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const waitForElement = (xp, labelName, timeoutMs = 10000) => new Promise((res, rej) => {
      const start = Date.now();
      const timer = setInterval(() => {
        const el = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (el) {
          clearInterval(timer);
          res(el);
        } else if (Date.now() - start > timeoutMs) {
          clearInterval(timer);
          rej(new Error(t.errorTimeout(labelName)));
        }
      }, 200);
    });

    // 觸控拖拽邏輯 (方便移動位置以免遮擋下方按鈕)
    let isDragging = false, offsetX = 0, offsetY = 0;
    helperBox.addEventListener('touchstart', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.touches.length !== 1) return;
      isDragging = true;
      const rect = helperBox.getBoundingClientRect();
      offsetX = e.touches[0].clientX - rect.left;
      offsetY = e.touches[0].clientY - rect.top;
      helperBox.style.transition = 'none';
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      helperBox.style.right = 'auto';
      helperBox.style.margin = '0';
      helperBox.style.left = (e.touches[0].clientX - offsetX) + 'px';
      helperBox.style.top = (e.touches[0].clientY - offsetY) + 'px';
    }, { passive: true });

    document.addEventListener('touchend', () => {
      isDragging = false;
      helperBox.style.transition = 'opacity 0.3s';
    });

    closeBtn.addEventListener('click', () => {
      helperBox.style.display = 'none';
    });

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

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        parsedNumbers = evt.target.result
          .split(/[\s,]+/)
          .map(n => parseInt(n.trim(), 10))
          .filter(n => !isNaN(n) && n >= 1 && n <= 49);

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

    startBtn.addEventListener('click', async () => {
      startBtn.disabled = true;
      fileInput.disabled = true;
      statusDiv.style.color = '#007bff';
      startBtn.innerText = t.startBtnRunning;

      try {
        for (let i = 0; i < parsedNumbers.length; i++) {
          const n = parsedNumbers[i];
          const ballXpath = `//div[contains(@class,"table-cell")]/div[contains(@class,"-ball") and normalize-space(text())="${n}"]`;
          statusDiv.innerText = t.statusRunning(n, i + 1, parsedNumbers.length);

          const ball = await waitForElement(ballXpath, `Ball_${n}`);
          ball.scrollIntoView({ block: 'center', behavior: 'instant' });
          ball.click();

          if (((i + 1) >= 60 && (i + 1) % 60 === 0) || (i + 1) === parsedNumbers.length) {
            statusDiv.innerText = t.stepAdd;
            (await waitForElement('//*[@data-testid="addToBetslip_button"]', 'addToBetslip_button')).click();
            await sleep(800);

            statusDiv.innerText = t.stepOpenSlip;
            (await waitForElement('//*[@id="bottom-menu-Int_Betslip"]', 'bottom-menu-Int_Betslip')).click();
            await sleep(1000);

            statusDiv.innerText = t.stepPlace;
            (await waitForElement('//*[@data-testid="bet_placeBet_button"]', 'bet_placeBet_button')).click();
            await sleep(1500);

            statusDiv.innerText = t.stepConfirm;
            (await waitForElement(`//button[contains(@class,"confirm") and starts-with(normalize-space(.), "${t.confirmText}")]`, 'Confirm_Button')).click();
            await sleep(1500);

            statusDiv.innerText = t.stepFinish;
            (await waitForElement('//*[@id="betslip_finish_button"]', 'betslip_finish_button')).click();
            await sleep(800);

            if ((i + 1) < parsedNumbers.length) {
              statusDiv.innerText = t.stepCloseSlip;
              (await waitForElement('//button[contains(@class,"switch-btn-icon") and contains(@class,"open-btn-icon")]', 'switch-btn-icon')).click();
              await sleep(1000);
            }
          }

          await sleep(150);
        }

        statusDiv.style.color = '#28a745';
        statusDiv.innerText = t.successDone;
        startBtn.style.display = 'none';
        resetBtn.style.display = 'block';
        fileInput.disabled = false;
      } catch (err) {
        statusDiv.style.color = '#dc3545';
        statusDiv.innerText = err.message || t.errorInterrupt;
        startBtn.style.display = 'none';
        resetBtn.style.display = 'block';
        fileInput.disabled = false;
      }
    });
  }

  window.__toggleMarkSixMobileHelper = function() {
    const existing = document.getElementById('hkjc-mobile-helper-container');
    if (!existing) {
      createMobileHelperBox();
      return;
    }
    const isHidden = existing.style.display === 'none';
    existing.style.display = isHidden ? 'block' : 'none';
    if (isHidden) {
      existing.style.opacity = '1';
    }
  };
})();