## Expo Image Picker App

## 環境

- Node.js: v20.16.0
- npm: v10.8.1

## 1. プロジェクトの作成

```bash
npx create-expo-app@latest expo-network-monitor-app
```

```bash
cd expo-network-monitor-app
npm run ios
# または
npm run android
```

不要なボイラープレートを削除する。

```bash
npm run reset-project
rm -rf app-example
```

## 2. ローカル Expo Module の作成

```bash
npx create-expo-module@latest --local

✔ What is the name of the local module? … network-monitor-module
✔ What is the native module name? … NetworkMonitorModule
✔ What is the Android package name? … expo.modules.networkmonitormodule
```

## 3. ネイティブプロジェクトの生成

```bash
npx expo prebuild --clean
```
