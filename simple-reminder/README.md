## Simpler Reminder

## 必要なもの

- Node.js
- npm
- Expo Account
- Cloudflare Account
- Wrangler CLI

## 1. バックエンドの開発

### 1.1 データベース作成

```bash
npx wragler d1 create simple-reminder-db
```

backend/wragler.toml を編集して、データベースの情報を追加します。

```toml
database_name = "simple-reminder-db"
database_id = "自分のDatabase ID"
```

マイグレーションを実行します。

```bash
npx wrangler d1 migrations apply __DATABASE_NAME__ --remote
npx prisma generate
```

### 1.2 バックエンドの開発

```bash
cd backend
npm install
npm run dev
```

### 1.3 バックエンドのデプロイ

https://expo.dev/accounts/[user]/settings/access-tokens へアクセスして[Personal access tokens]の[+ Create Token]ボタンからアクセストークンを作成します。

作成したアクセストークンを Cloudflare の環境変数に設定します。

```bash
npx wrangler secret put EXPO_ACCESS_TOKEN
```

バックエンドアプリをデプロイします。

```bash
npm run deploy
```

## 2. モバイルアプリの開発

### 2.1 モバイルアプリの開発

```bash
npm install
npm run start
```

### 2.2 モバイルアプリのビルド

まず Firebase のプロジェクトを作成し、`google-services.json`をダウンロードしてプロジェクト直下に配置します。
EAS Build 時にも必要なため環境変数として EAS 上にもアップロードします。

```bash
eas secret:create --scope project --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json
```

そして、モバイルアプリをビルドします。

```bash
eas build --prpfile preview
```
