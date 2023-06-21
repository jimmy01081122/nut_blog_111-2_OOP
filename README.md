# NTU_Blog

## 🪝簡介

NTU_Blog 是一個面向個人的集成文章發表、頁面創建、知識小冊等功能的 CMS 系統。涉及到的技術如下：

- `MySQL`：數據儲存
- `next.js`：前端頁面框架
- `nest.js`：服務端框架
- `AliyunOSS`：對象儲存

## 💎功能點

- 文章管理
- 頁面管理
- 知識小冊
- 評論管理
- 郵件管理
- 訪問統計
- 文件管理
- 系統設置

## 🛢️資料庫

首先安裝 `MySQL`，推薦使用 docker 進行安裝。

```bash
docker image pull mysql:5.7
docker run -d --restart=always --name wipi -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:5.7
```

然後在 `MySQL` 中創建資料庫。

```bash
docker container exec -it wipi bash;
mysql -u root -p;
CREATE DATABASE  `wipi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 🚀本地運行

安裝項目依賴。

```bash
# 全局安裝 pnpm
npm i -g pnpm

pnpm install
```

- 啟動項目

```bash
pnpm run dev
```

前台頁面地址：`http://localhost:3001`。
後台管理地址：`http://localhost:3002`。
服務介面地址：`http://localhost:3003`。

首次啟動，默認創建管理員用戶：admin，密碼：admin（可在 `.env` 文件中進行修改）。
[PS] 如服務端配置啟動失敗，請先確認 MySQL 的配置是否正確，配置文件在 `.env`。

## 🛰️系統設置

初次啟動時，需要在後台進行系統設置。隨著內容的豐富，頁面內容也會豐富起來。

## 🧷配置文件

默認載入 `.env` 文件，生產環境會嘗試載入 `.env.prod` 文件。

```bash
# 用戶端運行埠
CLIENT_PORT=3001
# 用戶端站點地址（假設部署到 https://xx.com, 就將 CLIENT_SITE_URL 設置為 https://xx.com）
CLIENT_SITE_URL=http://localhost:3001
# 用戶端資源地址（假設部署到 https://xx.com，就將 CLIENT_ASSET_PREFIX 設置為 https://xx.com，如果將資源上傳到 cdn ，那就改為 cdn 地址）
CLIENT_ASSET_PREFIX=/

# 管理後台運行埠
ADMIN_PORT=3002
# 管理後台資源地址（假設部署到 https://xx.com，就將 CLIENT_ASSET_PREFIX 設置為 https://xx.com，如果將資源上傳到 cdn ，那就改為 cdn 地址）
ADMIN_ASSET_PREFIX=/

# 服務端運行埠
SERVER_PORT=3003
# 服務端完整訪問路徑
SERVER_API_URL=http://localhost:3003/api
# 服務端介面前綴（假設將希望通過 http://xx:com/api 來訪問，那就設置為 /api；如果 http://xx:com，那就設置為 / ）
SERVER_API_PREFIX=/api
# 默認管理員帳戶名
ADMIN_USER=admin
# 默認管理員帳密碼
ADMIN_PASSWD=admin
# 以下為資料庫配置，請先創建好表
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWD=root
DB_DATABASE=wipi

# Github 第三方登錄配置
# 關於 Github OAuth 可參考 https://www.ruanyifeng.com/blog/2019/04/github-oauth.html
GITHUB_CLIENT_ID=0 # Github OAuth 登錄 Id
GITHUB_CLIENT_SECRET=0 # Github OAuth 登錄 Secret
```

## ⚙️項目部署

生產環境部署的腳本如下：

```bash

node -v
npm -v

npm config set registry http://registry.npmjs.org

npm i -g pm2 @nestjs/cli pnpm

pnpm install
pnpm run build
pnpm run pm2

pm2 startup
pm2 save
```
## 📜專案結構

### 根目錄
```
/
├── .env                      ＃ 環境變數設定
├── .prettierignore           ＃ 格式化設定檔案
├── .prettierrc               ＃ 格式化設定檔案
├── README.md
├── api.nginx.conf.bak        ＃ 部署至正式環境nginx設定檔
├── client.nginx.conf.bak     ＃ 部署至正式環境nginx設
├── locales                   ＃ i18n存放處
├── package.json              ＃ 專案套件列表
├── packages                  ＃ 專案主程式碼存放處
└── scripts                   ＃ 自動化佈署命令檔
```

### 後台前端
```
/packages/admin
├── .eslintignore             ＃ eslint設定檔
├── .eslintrc.js              ＃ eslint設定檔
├── .gitignore                
├── README.md
├── antd-custom.less
├── dev-server.js
├── next-env.d.ts
├── next.config.js            ＃ next設定檔
├── package.json              ＃ 專案套件列表
├── pages                     ＃ 頁面物件存放處
├── src
|  ├── assets                 ＃ 靜態資源存放處
|  ├── components             ＃ 通用物件存放處
|  ├── constants              ＃ 各種常數定義
|  ├── context                ＃ useContext定義處
|  ├── hooks                  ＃ custom hook存放處
|  ├── layout                 ＃ 背景模板存放處
|  ├── providers              ＃ 存放資料處理邏輯
|  ├── theme                  ＃ 背景主題css
|  └── utils                  ＃ 存放一些通用函式
├── tsconfig.json             ＃ ts設定檔
└── types                     ＃ 存放自定義type
```

### 前台前端
```
/packages/client
├── .eslintignore                 # ESLint 忽略檔案，包含不需要 lint 檢查的檔案和目錄
├── .eslintrc.js                  # ESLint 組態檔案，定義了程式碼格式規則
├── .gitignore                    # Git 忽略檔案，包含不需要納入版本控制的檔案和目錄
├── README.md                     # 專案項目說明文件
├── antd-custom.less              # Ant Design 的自訂樣式檔案
├── dev-server.js                 # 開發伺服器組態和指令碼
├── next-env.d.ts                 # Next.js 的 TypeScript 聲明檔案
├── next-sitemap.js               # Next.js 的 sitemap 組態檔案
├── next.config.js                # Next.js 的組態檔案
├── package.json                  # 定義項目依賴和組態的檔案
├── pages                         # 包含 Next.js 頁面元件的目錄
|  ├── 404.tsx                    # 自訂 404 錯誤頁面
|  ├── _app.tsx                   # 應用程式佈局元件
|  ├── _error.tsx                 # 自訂錯誤處理頁面
|  ├── archives                   # 歸檔頁面目錄
|  ├── article                    # 文章頁面目錄
|  ├── category                   # 分類頁面目錄
|  ├── index.module.scss          # 首頁的樣式檔案
|  ├── index.tsx                  # 首頁
|  ├── knowledge                  # 知識頁面目錄
|  ├── login                      # 登錄頁面目錄
|  ├── page                       # 靜態頁面目錄
|  ├── rss                        # RSS 頁面目錄
|  └── tag                        # 標籤頁面目錄
├── prod-server.js                # 生產環境伺服器組態和指令碼
├── public                        # 公共靜態資源，例如圖示和圖像
├── src                           # 包含原始碼的目錄
|  ├── components                 # React 元件目錄
|  ├── context                    # React useContext相關檔案
|  ├── hooks                      # React 自訂hook
|  ├── layout                     # 佈局元件目錄
|  ├── providers                  # 提供者元件目錄（如主題、狀態管理等）
|  ├── rss                        # RSS 相關檔案
|  ├── theme                      # 主題相關檔案
|  └── utils                      # 實用工具和函數
├── tsconfig.json                 # TypeScript 組態檔案
└── types                         # TypeScript 類型定義目錄
   └── index.d.ts                 # TypeScript 類型定義檔案
```

### 後端伺服器
```
/packages/server
├── .eslintignore                 # ESLint 忽略檔，設定不需要進行程式碼檢查的檔案和目錄
├── .eslintrc.js                  # ESLint 配置檔，設定程式碼格式和規則
├── .gitignore                    # Git 忽略檔，設定不需要加入版本控制的檔案和目錄
├── README.md                     # README 檔案，包含專案的說明和文件
├── nest-cli.json                 # NestJS 命令列工具的配置檔
├── package.json                  # 定義專案的依賴和配置的檔案
├── src                           # 原始碼目錄
|  ├── app.module.ts              # 主要的 NestJS 模組檔
|  ├── filters                    # 過濾器目錄
|  ├── interceptors               # 攔截器目錄
|  ├── logger                     # 日誌記錄器目錄
|  ├── main.ts                    # 專案的主要入口檔
|  ├── modules                    # 模組目錄
|  └── utils                      # 工具類目錄
├── test                          # 測試目錄
|  ├── app.e2e-spec.ts            # 端對端測試檔
|  └── jest-e2e.json              # Jest 端對端測試配置檔
├── tsconfig.build.json           # TypeScript 編譯配置檔，用於建置
├── tsconfig.json                 # TypeScript 編譯配置檔
└── tslint.json                   # TSLint 配置檔，用於 TypeScript
```

### 設定
```
/packages/config
├── .gitignore                    # Git 忽略檔，設定不需要加入版本控制的檔案和目錄
├── README.md                     # 專案的說明文件
├── lib                           # 編譯後的程式碼目錄
|  ├── env.d.ts                   # 環境配置的 TypeScript 型別定義檔
|  ├── env.js                     # 環境配置的編譯後的 JavaScript 檔
|  ├── i18n.d.ts                  # 國際化配置的 TypeScript 型別定義檔
|  ├── i18n.js                    # 國際化配置的編譯後的 JavaScript 檔
|  ├── index.d.ts                 # 主索引的 TypeScript 型別定義檔
|  └── index.js                   # 主索引的編譯後的 JavaScript 檔，匯出 lib 目錄中的模組
├── package.json                  # 定義專案的依賴和配置的檔案
└── src                           # 原始碼目錄
   ├── env.ts                     # 環境配置的原始 TypeScript 檔
   ├── i18n.ts                    # 國際化配置的原始 TypeScript 檔
   └── index.ts                   # 主索引的原始 TypeScript 檔，匯出 src 目錄中的模組
```
## 📂使用套件與工具

- next.js 前端框架
- nest.js 後端框架
- pnpm 套件管理
- concurrently 多線程指令工具
- git 版本管理
- prettier 程式碼格式管理
- ESLint 程式碼格式管理
- nginx 反向代理伺服器
- docker 伺服器部署
- typeScript 型別版的js
- mysql 資料庫
- 阿里雲 雲端儲存空間
- Google Analytics 流量分析
- i18n 多國語言管理套件 
