## Expo Push Notifications App

## 環境

- Node.js: v20.16.0
- npm: v10.8.1

## 1. プロジェクトの作成

```bash
npx create-expo-app@latest expo-push-notifications-app
```

```bash
cd expo-push-notifications-app
npm run ios
# または
npm run android
```

不要なボイラープレートを削除する。

```bash
npm run reset-project
rm -rf app-example
```

## 2. ライブラリのインストール

```bash
npx expo install expo-notifications expo-device expo-constants
```
