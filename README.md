# 個人網站與 Hexo 原始專案

此 repo 同時保存 Hexo 原始專案與 GitHub Pages 使用的靜態網頁。

- `_hexo/source/`：六個頁面的 Markdown、照片與 PDF 附件。
- `_hexo/themes/Academia/`：共用版型、樣式、導覽與個人側欄設定。
- `_hexo/_config.yml`：Hexo 網站設定。
- `_hexo/public/`：建置產物，不納入 Git。
- 根目錄的 `index.html`、各頁目錄、`css/`、`js/`、`img/`、`attaches/`：發布用網頁。

之後請修改 `_hexo/` 裡的原始檔，再產生並匯出網頁。

## 安裝與預覽

在 repo 根目錄執行。第一次使用或重新複製 repo 時，先安裝鎖定版本的依賴：

```sh
npm --prefix _hexo ci
npm --prefix _hexo run server
```

開啟 <http://localhost:4000> 預覽，按 Ctrl+C 結束。

## 建置與更新發布檔案

只建置到 `_hexo/public/`，不改動根目錄網頁：

```sh
npm --prefix _hexo run build
```

查看匯出會更新哪些檔案：

```sh
node _hexo/tools/export-site.cjs --dry-run
```

重新建置並將結果複製到 repo 根目錄：

```sh
npm --prefix _hexo run export
```

匯出只更新工具內 `publishedPaths` 指定的網站目錄，不會刪除檔案，也不會提交或推送 Git。新增頁面目錄時，請同步更新 `_hexo/tools/export-site.cjs` 的 `publishedPaths`；刪除或改名頁面時，請檢查並手動移除根目錄中已不用的發布檔案。

確認差異後，再依既有 GitHub Pages 流程提交與推送 `_hexo/` 原始檔和根目錄的發布檔案。只提交原始檔不會更新網頁內容。

請保留 `_hexo/_config.yml` 的 `public_dir: public`；不要改成 `..` 或 repo 根目錄，因為 Hexo clean 會刪除整個輸出目錄。

## 整合紀錄

2026-10-09 從 iCloud 的 `Documents/CV` 複製原始專案，iCloud 原檔保留。匯入的 `_hexo/source/attaches/CV_YHLin.pdf` 採用 GitHub 提交 `7213b295b1a5f5da7e00bcdeaa6a1eebab9c43a4` 的新版附件，避免重建時退回舊版。

同日更新網站 CV 下載檔：目前的 `CV_YHLin.pdf` 由 `yenhsunlin/CV_plain` 提交 `e40eee6610b15edd2d8888ef5970d7a29a2fd68d` 的 `cv_polished.tex` 原稿編譯，保留該版 CV 的完整內容。首頁不再提供不含論文列表的舊 Résumé 下載連結。

整合時保留根目錄既有的發布檔案。乾淨建置只產生目前主題使用的檔案，部分舊樣式與 Fancybox 資產仍留在根目錄；匯出工具不會自動移除它們。頁尾年份由主題自動使用當前年份。

原 iCloud 專案的 Dependabot 設定未啟用在此 repo，部署設定也未變更。此資料夾中的 `_hexo/` 使用底線開頭，依 [Jekyll 的目錄規則](https://jekyllrb.com/docs/structure/) 預設不會被複製到發布網站。
