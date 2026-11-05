# HKJC Mark Six Auto-Bet Helper (六合彩自動投注助手)

An open-source Chrome Extension (Manifest V3) that automates ball selection and bet slip submissions on the official Hong Kong Jockey Club (HKJC) website using local CSV/TXT files copied from Excel or text editors.

> 💻 **目前版本限制 (Desktop Only)**：本擴充功能目前僅支援桌上型電腦/筆電瀏覽器（Desktop Version），暫不適用於行動裝置（Mobile）。行動裝置支援規劃將於未來版本陸續推出。
> 
> 💻 **Platform Note**: Currently designed for Desktop browsers. Mobile support is not yet available and is planned for future updates.

[中文說明](#中文說明) | [English Guide](#english-guide)

---

## 中文說明

### 🌟 專案亮點
* **100% 本地運作 & 隱私安全**：無任何伺服器傳輸，資料只在瀏覽器端本地處理。
* **支援多種資料分隔格式**：可讀取由 Excel、記事本或 CSV 匯出的 **Tab (製表符)、逗號 (Comma)、空白或換行** 分隔之數據檔 (`.csv`, `.txt`)。
* **雙語介面**：自動偵測馬會網頁語系（繁體中文 / English）。
* **可拖拽 UI**：畫面右上角懸浮控制盒，支援隨意拖拽避免遮擋投注區。
* **防呆與錯誤重試**：遇到網路延遲或元素未回應時提供清晰錯誤提示，並支援一鍵【重置 / 重新啟動】。

---

### 📱 推薦搭配手機 App：智運贏六合彩 (MarkSix AI&Luck)

想要更智慧地生成號碼並一鍵導出 CSV？歡迎下載我們的同款手機 App！支援 AI 智慧選號與運勢預測，並可直接將結果導出為 CSV 檔，搭配本 Chrome 助手實現極速自動投注：

* 🍏 **iOS 版本 (App Store)**：[MarkSix AI&Luck 智運贏六合彩](https://apps.apple.com/us/app/marksix-ai-luck/id6788589296)
* 🤖 **Android 版本 (Google Play)**：[MarkSix AI&Luck 智運贏六合彩](https://play.google.com/store/apps/details?id=com.ck01app.zyymarksix)

---

### 🚀 安裝方式

#### 方式 1：自 Chrome 線上應用程式商店安裝 (推薦)
1. 前往 [Chrome Web Store](https://chromewebstore.google.com) 搜尋 **「MarkSix Auto-Bet Helper」**。
2. 點擊 **「加到 Chrome」** 即可完成安裝。

#### 方式 2：下載 GitHub Release 封裝檔
1. 在本 GitHub 專案右側欄位的 **Releases** 下載最新版的 `marksix-autobet-vX.X.zip` 檔並解壓縮。
2. 開啟 Chrome 瀏覽器，前往 `chrome://extensions/`。
3. 開啟右上角的 **「開發人員模式 (Developer mode)」**。
4. 點擊左上角 **「載入未封裝套件 (Load unpacked)」**，選擇剛剛解壓縮的資料夾即可。

---

### 📖 使用教學
1. 開啟馬會六合彩官方投注網頁 (`https://bet.hkjc.com/ch/marksix/`)。
2. 手動登入您的馬會投注帳戶。
3. 網頁右上角會自動載入綠色的「六合彩自動投注助手」懸浮控制盒。
4. 點擊 **「選擇檔案」**，上傳由 **智運贏六合彩 App** 或 Excel 匯出的 `.csv` / `.txt` 號碼檔。
5. 確認顯示載入的號碼與注數無誤後，點擊 **「開始自動選號」**。

---

### ☕ 支持與贊助 (Support)
如果您覺得這個工具對您有所幫助，歡迎請我喝杯咖啡！您的支持是我維持開源更新的動力：
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow.svg)](https://buymeacoffee.com/winterforest)

---

## English Guide

### 🌟 Features
* **100% Privacy Focused**: Runs completely locally inside your browser. No data is sent to external servers.
* **Flexible Delimiter Support**: Supports files formatted with **Comma (,), Tab, Space, or Newline** (`.csv`, `.txt`).
* **Bilingual UI**: Automatically matches the HKJC site language (Traditional Chinese / English).
* **Draggable Interface**: Floating overlay widget can be dragged anywhere on screen.
* **Error Handling & Reset**: Real-time progress updates with timeout defenses and a one-click **Reset / Restart** button.

---

### 📱 Mobile App Recommendation: MarkSix AI&Luck

Generate smart bets on the go! Use our companion mobile app **MarkSix AI&Luck** to analyze numbers and export bet predictions directly into CSV files for seamless auto-betting with this desktop extension:

* 🍏 **iOS (App Store)**: [MarkSix AI&Luck](https://apps.apple.com/us/app/marksix-ai-luck/id6788589296)
* 🤖 **Android (Google Play)**: [MarkSix AI&Luck](https://play.google.com/store/apps/details?id=com.ck01app.zyymarksix)

---

### 🚀 Installation

#### Method 1: Chrome Web Store (Recommended)
1. Search for **"MarkSix Auto-Bet Helper"** on the [Chrome Web Store](https://chromewebstore.google.com).
2. Click **"Add to Chrome"**.

#### Method 2: Manual Installation via Release ZIP
1. Download the latest `marksix-autobet-vX.X.zip` from the **Releases** section on GitHub and unzip it.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **"Developer mode"** in the top right corner.
4. Click **"Load unpacked"** and select the unzipped directory.

---

### ☕ Support
If this project has saved you time or made your workflow easier, consider buying me a coffee to support future open-source development!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow.svg)](https://buymeacoffee.com/winterforest)

---

## 📄 File Format Example (範例數據格式)

You can use either **CSV (Comma-separated)** or **TXT (Tab-separated)** formats. Numbers must be integers between `1` and `49`.

**Comma-separated (`.csv`):**
```csv
1, 5, 12, 18, 24, 33
2, 8, 15, 20, 31, 45
```

**Tab-separated (`.txt` / copied directly from Excel):**
```text
1	5	12	18	24	33
2	8	15	20	31	45
```

---

## ⚖️ License
Distributed under the **MIT License**. See `LICENSE` for more information.