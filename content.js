(function() {
  'use strict';

  // 鮮豔的日誌樣式
  const logStyle = "color: #ffffff; background: #007bff; padding: 4px 8px; border-radius: 4px; font-weight: bold;";
  const successStyle = "color: #ffffff; background: #28a745; padding: 4px 8px; border-radius: 4px; font-weight: bold;";
  const errorStyle = "color: #ffffff; background: #dc3545; padding: 4px 8px; border-radius: 4px; font-weight: bold;";

  console.log("%c【六合彩助手 DEBUG】1. 腳本代碼成功被 Chrome 載入並開始執行！", logStyle);

  function initHelper() {
    console.log("%c【六合彩助手 DEBUG】2. initHelper 函數被成功觸發！", logStyle);

    if (!document.body) {
      setTimeout(initHelper, 1000);
      return;
    }

    if (document.getElementById('helper-file-input')) {
      return;
    }

    try {
      // 1. 在網頁右上角創造懸浮控制盒
      const helperBox = document.createElement('div');
      helperBox.id = 'hkjc-helper-box-container';
      helperBox.style.position = 'fixed';
      helperBox.style.top = '120px'; 
      helperBox.style.right = '20px';
      helperBox.style.zIndex = '9999999'; 
      helperBox.style.padding = '15px';
      helperBox.style.background = '#ffffff';
      helperBox.style.border = '3px solid #28a745';
      helperBox.style.borderRadius = '8px';
      helperBox.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
      helperBox.style.width = '260px'; 
      helperBox.style.fontFamily = 'Arial, sans-serif';
      helperBox.style.transition = "opacity 0.3s"; 
      
      // 💡 增加拖拽手勢：提示使用者這裡可以用滑鼠抓著移動
      helperBox.style.cursor = 'move'; 

      helperBox.innerHTML = `
        <button id="helper-close-btn" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: #dc3545; font-size: 20px; font-weight: bold; cursor: pointer; padding: 0 5px; line-height: 1; z-index: 10;">×</button>
        <h4 style="margin: 0 0 10px 0; color: #333; font-size: 16px; font-weight: bold; padding-right: 20px; user-select: none;">六合彩自動投注快線</h4>
        <p style="font-size: 12px; color: #666; margin-bottom: 10px; user-select: none;">請先手動登入馬會帳戶，然後選擇檔案。</p>
        <input type="file" id="helper-file-input" accept=".csv,.txt" style="width: 100%; margin-bottom: 10px; cursor: default;" />
        <button id="helper-start-btn" disabled style="width: 100%; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;">開始自動選號</button>
        <div id="helper-status" style="margin-top: 10px; font-size: 12px; font-weight: bold; color: #666; user-select: none;">等待上傳 Excel 複製的文字檔...</div>
      `;

      document.body.appendChild(helperBox);

      // 綁定事件
      const fileInput = document.getElementById('helper-file-input');
      const startBtn = document.getElementById('helper-start-btn');
      const statusDiv = document.getElementById('helper-status');
      const closeBtn = document.getElementById('helper-close-btn');

      let parsedNumbers = [];
      const sleep = ms => new Promise(r => setTimeout(r, ms));

      const waitForElement = (xpath, timeout = 10000) => {
        return new Promise((resolve, reject) => {
          const start = Date.now();
          const timer = setInterval(() => {
            const el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (el) { clearInterval(timer); resolve(el); }
            else if (Date.now() - start > timeout) { clearInterval(timer); reject(new Error('Timeout')); }
          }, 200);
        });
      };

      // 💡 核心修改：加入滑鼠點擊拖拽的底層邏輯
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      helperBox.addEventListener('mousedown', (e) => {
        // 如果點擊的是按鈕或輸入框，不要觸發拖拽，否則按鈕會點不下去
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
        
        isDragging = true;
        // 計算滑鼠當前位置與控制盒左上角的相對距離
        offsetX = e.clientX - helperBox.offsetLeft;
        offsetY = e.clientY - helperBox.offsetTop;
        
        // 拖拽時取消平滑過渡，防止畫面延遲滑動
        helperBox.style.transition = "none";
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        // 強制解除右邊和頂部的死鎖，改用左邊和頂部定位來移動
        helperBox.style.right = 'auto';
        helperBox.style.left = (e.clientX - offsetX) + 'px';
        helperBox.style.top = (e.clientY - offsetY) + 'px';
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
        // 恢復淡出所需的動畫過渡效果
        helperBox.style.transition = "opacity 0.3s";
      });

      // 關閉按鈕事件
      closeBtn.addEventListener('click', () => {
        helperBox.style.opacity = "0";
        setTimeout(() => {
          helperBox.remove();
          console.log("【六合彩助手】控制盒已關閉。");
        }, 300);
      });

      // 2. 讀取與解析上傳的 Tab 分隔文字檔
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0]; 
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(evt) {
          const text = evt.target.result;
          
          parsedNumbers = text.split(/[\s,]+/)
                              .map(n => parseInt(n.trim(), 10))
                              .filter(n => !isNaN(n) && n >= 1 && n <= 49);

          if (parsedNumbers.length > 0) {
            statusDiv.style.color = '#28a745';
            statusDiv.innerText = `成功載入 ${parsedNumbers.length} 個號碼 (${Math.ceil(parsedNumbers.length / 6)} 注)`;
            startBtn.disabled = false;
          } else {
            statusDiv.style.color = '#dc3545';
            statusDiv.innerText = "無法解析號碼！請確保檔案內有有效數字。";
            startBtn.disabled = true;
          }
        };
        reader.readAsText(file);
      });

      // 3. 自動化選號點擊邏輯
      startBtn.addEventListener('click', async () => {
        startBtn.disabled = true;
        fileInput.disabled = true;
        statusDiv.style.color = '#007bff';

        for (let i = 0; i < parsedNumbers.length; i++) {
          const n = parsedNumbers[i];
          const row = Math.floor((n - 1) / 10) + 1;
          const col = ((n - 1) % 10) + 1;
          const ballXpath = `//*[@id="ball-panel-table"]/div[${row}]/div[${col}]/div`;

          statusDiv.innerText = `正在點擊號碼: ${n} (${i + 1}/${parsedNumbers.length})`;

          try {
            const ball = document.evaluate(ballXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (ball) {
              ball.click();
            }
          } catch (e) {
            console.error(e);
          }

          if (((i + 1) >= 60 && (i + 1) % 60 === 0) || (i + 1) === parsedNumbers.length) {
            try {
              statusDiv.innerText = "正在處理：添加到投注區...";
              (await waitForElement('//*[@id="Add_to_Slip"]')).click();
              await sleep(1000);

              statusDiv.innerText = "正在處理：發送注項...";
              (await waitForElement('//*[@data-testid="bet_placeBet_button"]')).click();
              await sleep(2000);

              statusDiv.innerText = "正在處理：確定投注...";
              (await waitForElement('//button[starts-with(text(), "確定")]')).click();
              await sleep(2000);
            } catch (err) {
              console.error(err);
              statusDiv.style.color = '#dc3545';
              statusDiv.innerText = "自動化流程中斷，請檢查網頁狀態。";
              break;
            }
          }
          await sleep(150);
        }

        statusDiv.style.color = '#28a745';
        statusDiv.innerText = "所有注項已全數自動化投注完畢！";
        startBtn.disabled = false;
        fileInput.disabled = false;
      });

    } catch (err) {
      console.error(err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHelper);
  } else {
    initHelper();
  }

})();
