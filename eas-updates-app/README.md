## EAS Updates Demo App

## 環境

- Node.js: v20.16.0
- npm: v10.8.1

## 1. プロジェクトの作成

```bash
npx create-expo-app@latest expo-pomodoro-app
```

```bash
cd expo-pomodoro-app
npm run ios
# または
npm run android
```

不要なボイラープレートを削除する。

```bash
npm run reset-project
rm -rf app-example
```

## 2. EAS Updates の設定

```bash
eas update:configure
```

## 3. EAS Build の設定

```bash
eas build:configure
```

以下のような eas.json が生成される。

```json
{
  "cli": {
    "version": ">= 13.1.1",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "autoIncrement": true,
      "channel": "production"
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 4. EAS Build の実行

Preview 用のビルドを実行する。

```bash
eas build --profile preview --platform android
```

ビルドが完了したら、Android 端末にビルドしたアプリをインストールする。

## 5. コードの変更

app/index.tsx を以下のように変更する。

```tsx
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello World!</Text>
    </View>
  );
}
```

## 6. EAS Update の実行

```bash
eas update --branch fix/typo --message "Fixes typo"
```

## 7. Branch 　の切り替え

```bash
eas channel:edit preview
```
