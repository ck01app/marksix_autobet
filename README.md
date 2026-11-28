# HKJC Mark Six Auto-Bet Helper (六合彩自動投注助手)

An open-source Chrome Extension (Manifest V3) that automates ball selection and bet slip submissions on the official Hong Kong Jockey Club (HKJC) website using local CSV/TXT files copied from Excel or text editors.

> ⚠️ **發行與安裝說明 (Distribution Notice)**：
> 由於 Chrome 線上應用程式商店 (Chrome Web Store) 嚴格限制涉及博彩／彩票自動化之擴充功能上架，本專案**僅提供 GitHub Releases 手動載入（Load unpacked）安裝**，無提供商店一鍵安裝版本。
>
> 💻 **平台支援說明 (Platform Support)**：
> * **Desktop Version**：支援桌上型電腦/筆電瀏覽器（Chrome / Edge / Brave 等）。
> * **Android Mobile Version**：支援具備擴充功能之 Android 瀏覽器（如 **Titanium Browser**），請使用專屬的 `titanium/` 行動版套件。

[中文說明](#中文說明) | [English Guide](#english-guide)

## 中文說明

### 🌟 專案亮點

* **100% 本地運作 & 隱私安全**：無任何伺服器傳輸，資料只在瀏覽器端本地處理。

* **支援多種資料分隔格式**：可讀取由 Excel、記事本或 CSV 匯出的 **Tab (製表符)、逗號 (Comma)、空白或換行** 分隔之數據檔 (`.csv`, `.txt`)。

* **雙語介面**：自動偵測馬會網頁語系（繁體中文 / English）。

* **桌面與手機雙版本支援**：

  * **桌面版**：點擊工具列圖示開啟可拖拽懸浮控制盒，精準對應桌面版選號與分批投注流程。

  * **Android 手機版 (Titanium Browser)**：專為手機窄螢幕與觸控拖拽優化，完整支援行動版網頁 7 步驟自動選號、開啟投注區、發送、確定與完成流程。

* **防呆與錯誤重試**：遇到網路延遲或元素未回應時提供清晰錯誤提示，並支援一鍵【重置 / 重新啟動】。

### 📱 推薦搭配手機 App：智運贏六合彩 (MarkSix AI&Luck)

想要更智慧地生成號碼並一鍵導出 CSV？歡迎下載我們的同款手機 App！支援 AI 智慧選號與運勢預測，並可直接將結果導出為 CSV 檔，搭配本助手實現極速自動投注：

* 🍏 **iOS 版本 (App Store)**：[MarkSix AI&Luck 智運贏六合彩](https://apps.apple.com/us/app/marksix-ai-luck/id6788589296)

* 🤖 **Android 版本 (Google Play)**：[MarkSix AI&Luck 智運贏六合彩](https://play.google.com/store/apps/details?id=com.ck01app.zyymarksix)

### 🚀 手動安裝方式 (Manual Installation Only)

本專案完全開源，請從 GitHub Releases 下載對應平台的壓縮檔並透過「開發人員模式」手動載入：

#### 方式 1：桌面版安裝 (Desktop Chrome / Edge / Brave)

1. 前往本 GitHub 專案右側欄位的 **Releases** 下載最新桌面版 `marksix-autobet-vX.X.zip` 並解壓縮。

2. 開啟桌面版瀏覽器，前往 `chrome://extensions/`。

3. 開啟右上角的 **「開發人員模式 (Developer mode)」**。

4. 點擊左上角 **「載入未封裝套件 (Load unpacked)」**，選擇解壓縮後的資料夾即可。

#### 方式 2：Android 手機版安裝 (Titanium Browser)

1. 前往本 GitHub 專案右側欄位的 **Releases** 下載手機專屬版 `marksix-autobet-titanium-v1.0.zip` 並解壓縮至手機儲存空間（或直接複製專案中的 `titanium/` 資料夾）。

2. 開啟 Android 上的 **Titanium Browser**，在網址列輸入並前往 `chrome://extensions/`。

3. 開啟 **「開發人員模式 (Developer mode)」**。

4. 點擊 **「載入未封裝套件 (Load unpacked)」**，選擇解壓縮後的 `titanium` 資料夾即可完成安裝。

### 📖 使用教學

1. 開啟馬會六合彩官方投注網頁 (`https://bet.hkjc.com/ch/marksix/`) 並手動登入帳戶。

2. 點擊瀏覽器工具列（或手機瀏覽器擴充功能選單）中的 **「MarkSix Auto-Bet Helper」** 圖示，畫面即會彈出綠色控制盒。

3. 點擊 **「選擇檔案」**，上傳由 **智運贏六合彩 App** 或 Excel 匯出的 `.csv` / `.txt` 號碼檔。

4. 確認顯示載入的號碼與注數無誤後，點擊 **「開始自動選號」**。

### ☕ 支持與贊助 (Support)

如果您覺得這個工具對您有所幫助，歡迎請我喝杯咖啡！您的支持是我維持開源更新的動力：

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support%20Developer-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/winterforest)

### ⚠️ 免責聲明 (Disclaimer)

* 本擴充功能（MarkSix Auto-Bet Helper）為獨立開源輔助工具，與香港賽馬會 (HKJC) 無任何官方關聯。

* 開發者不保證香港賽馬會網站隨時變動的網頁結構與本工具完全相容。使用者須自行承擔使用本工具進行自動化操作所產生的所有風險與責任。

* 博彩涉及金錢風險，請量力而為。本工具僅用於提升手動輸入效率，開發者不對任何投注結果、系統延遲或金錢損失負責。

## English Guide

### 🌟 Features

* **100% Privacy Focused**: Runs completely locally inside your browser. No data is sent to external servers.

* **Flexible Delimiter Support**: Supports files formatted with **Comma (,), Tab, Space, or Newline** (`.csv`, `.txt`).

* **Bilingual UI**: Automatically matches the HKJC site language (Traditional Chinese / English).

* **Desktop & Android Titanium Support**:

  * **Desktop Build**: Toolbar-triggered draggable widget tailored for the desktop HKJC grid and batch submission flow.

  * **Android Mobile Build (Titanium Browser)**: Responsive touch-draggable widget built in `titanium/` supporting the 7-step HKJC mobile betslip flow.

* **Error Handling & Reset**: Real-time progress updates with timeout defenses and a one-click **Reset / Restart** button.

### 📱 Mobile App Recommendation: MarkSix AI&Luck

Generate smart bets on the go! Use our companion mobile app **MarkSix AI&Luck** to analyze numbers and export bet predictions directly into CSV files for seamless auto-betting:

* 🍏 **iOS (App Store)**: [MarkSix AI&Luck](https://apps.apple.com/us/app/marksix-ai-luck/id6788589296)

* 🤖 **Android (Google Play)**: [MarkSix AI&Luck](https://play.google.com/store/apps/details?id=com.ck01app.zyymarksix)

### 🚀 Manual Installation Only

Due to Chrome Web Store policies restricting gambling and lottery automation extensions, this tool is distributed **exclusively via GitHub Releases** for manual installation (`Load unpacked`):

#### Method 1: Desktop Browsers (Chrome / Edge / Brave)

1. Download the latest desktop release `marksix-autobet-vX.X.zip` from the **Releases** section on GitHub and unzip it.

2. Open your browser and navigate to `chrome://extensions/`.

3. Enable **"Developer mode"** in the top right corner.

4. Click **"Load unpacked"** and select the unzipped directory.

#### Method 2: Android Mobile (Titanium Browser)

1. Download the dedicated mobile release `marksix-autobet-titanium-v1.0.zip` from GitHub **Releases** and unzip it on your device (or copy the `titanium/` folder from this repo).

2. Open **Titanium Browser** on Android and navigate to `chrome://extensions/`.

3. Enable **"Developer mode"**.

4. Tap **"Load unpacked"** and select the unzipped `titanium` directory.

### 📖 Usage

1. Navigate to the official HKJC Mark Six page (`https://bet.hkjc.com/en/marksix/` or `/ch/marksix/`) and log in manually.

2. Click the **MarkSix Auto-Bet Helper** icon in your browser toolbar (or extension menu on Titanium) to open the floating control box.

3. Click **Choose File** and upload your `.csv` or `.txt` file exported from **MarkSix AI&Luck** or Excel.

4. Verify the parsed number and bet counts, then click **Start Auto-Betting**.

### ☕ Support

If this project has saved you time or made your workflow easier, consider buying me a coffee to support future open-source development!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support%20Developer-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/winterforest)

### ⚠️ Disclaimer

* This extension (MarkSix Auto-Bet Helper) is an independent open-source tool and is NOT affiliated with, endorsed by, or connected to the Hong Kong Jockey Club (HKJC).

* The developer does not guarantee compatibility with future updates to the HKJC website structure. Users assume all risks and responsibilities associated with using this tool for automated actions.

* Gambling involves financial risk. Please bet responsibly. This tool is intended solely to improve manual entry efficiency, and the developer accepts no liability for any betting outcomes or financial losses.

## 📄 File Format Example (範例數據格式)

You can use either **CSV (Comma-separated)** or **TXT (Tab-separated)** formats. Numbers must be integers between `1` and `49`.

**Comma-separated (`.csv`):**

```
1, 5, 12, 18, 24, 33
2, 8, 15, 20, 31, 45
```

**Tab-separated (`.txt` / copied directly from Excel):**

```
1	5	12	18	24	33
2	8	15	20	31	45
```

## ⚖️ License

Distributed under the **MIT License**. See `LICENSE` for more information.