---
name: book-slides
description: 將書本章節截圖轉換成 Reveal.js HTML 投影片（繁體中文讀書會報告風格）。當使用者提供書本頁面的照片或截圖，並要求製作簡報時觸發。輸出為單一 slides.html 檔案，暗色主題、左對齊、Noto Sans TC 字型。
---

# Book Slides

將書本截圖轉為 Reveal.js 投影片的工作流程。

## Step 1 — 圖片品質檢查

讀取使用者提供的每張圖片，逐一評估：
- 文字是否清晰可辨識
- 角度是否過度偏斜
- 光線是否足夠

**如有任何圖片無法清楚判讀**，列出問題圖片並請使用者重拍，不要猜測或強行解讀模糊內容。確認所有圖片清晰後才進入下一步。

## Step 2 — 範圍確認

在讀取內容之前，先向使用者確認：
- 這批圖片涵蓋哪些章節／小節？（例如：19-1 到 19-5）
- 是否有某些小節不需要包含在投影片中？
- 有無特別想強調或略過的內容？

**等使用者確認範圍後**，再進入下一步。

## Step 3 — 內容提取與規劃

讀取所有圖片，萃取：
- 各節標題與編號（如 9-1、9-2）
- 重點概念、清單、表格、引言
- 實作範例或案例

**只使用圖片中明確寫出的原文內容，不推斷或補充書上沒有的資訊。**

以大綱形式列出投影片規劃，與使用者確認後再產生 HTML。典型結構：

1. 封面
2. 本章目標
3. 各節分隔頁 → 各節內容頁（可多頁）
4. 總結
5. 實作題目 / Q&A

## Step 4 — 產生投影片

以 `assets/template.html` 為基底，填入內容。元件選用請參考 `references/components.md`。

**版面規則（每頁都要遵守）**：
- 內容不超過螢幕高度（700px）
- 條列超過 6 項 → 加 `font-size: 0.82em` 或拆成多頁（標題加 `1/2`、`2/2`）
- 表格欄位多時加 `font-size: 0.8em`
- blockquote 不超過 3 行
- 文字量大的頁面優先縮字，其次才拆頁

## Step 5 — 輸出

將完成的 HTML 寫入正確的目錄，**路徑格式為**：

```
Book/<書名>/<章節名>/slides.html
```

例如：
- `Book/vibeCoding聖經/Chapter20/slides.html`
- `Book/重構的時機與實作-五行程式碼規則/Chapter5/slides.html`

如果這本書還沒有資料夾，就新建一個，資料夾名稱與書名相同（不含 `[ Book ]` 前綴）。

---

## 整合注意事項（Web 專案）

這個 repo 有一個 Vue 3 web 專案（`web/`），會自動掃描 `Book/` 資料夾並呈現所有投影片與筆記。

### 自動掃描規則

| 類型 | 放置位置 | 說明 |
|---|---|---|
| 投影片 | `Book/<書名>/<章節>/slides.html` | 章節名顯示為投影片標題 |
| 投影片（總覽） | `Book/<書名>/slides.html` | 顯示為「總覽」 |
| 筆記 | `Book/[ Book ] <書名>.md` | root 層的 md 檔 |
| 章節筆記 | `Book/<書名>/<章節>.md` | 從 HackMD 抓下來的章節 |

### 新增後的流程

```bash
# 1. 確認本地正常
cd web && npm run dev

# 2. commit 並 push（GitHub Actions 自動部署）
git add Book/<書名>/
git commit -m "feat: add <書名> <章節> slides"
git push
```

### 命名規則

- 書名資料夾：不含 `[ Book ]` 前綴，大小寫與原始書名完全相同
- 章節資料夾：自由命名，建議用 `Chapter9`、`Chapter19` 格式（跟書本章節對齊）
- `slides.html` 固定這個名稱，其他 HTML 檔名不會被掃到

### 網站 URL

**https://weijaa.github.io/booksReading/**

push 到 main 後 GitHub Actions 約 1-2 分鐘部署完成。
