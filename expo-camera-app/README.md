## Expo Camera App

## 環境

- Node.js: v22.20.0
- npm: v10.9.3

## 1. プロジェクトの作成

```bash
npx create-expo-app@latest expo-camera-app
cd expo-camera-app

# iOSシミュレータまたはAndroidエミュレータで起動
npm run ios
# または
npm run android
```

シミュレータで起動が確認できたら、不要なボイラープレートを削除する。

```bash
npm run reset-project
```

## 2. Expo Camera をインストール

```bash
npx expo install expo-camera
```

## 3. カメラ機能の実装

app/index.tsx:

```tsx
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // カメラパーミッションの読み込み中
    return <View />;
  }

  if (!permission.granted) {
    // カメラパーミッションが拒否された
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>カメラ反転</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
```

## 4. QR・バーコードリーダーの実装

コードを追加、修正して、QRコード・バーコードリーダーを実装する。

app/index.tsx:

```tsx
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";

export default function Index() {
  const [barcodeResult, setBarcodeResult] = useState<string | null>(null);

  // コード省略

  function onBarCodeScanned({ data }: BarcodeScanningResult) {
    setBarcodeResult(data);
  }

   // JSX部分は以下のように差し替え
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={onBarCodeScanned}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.text}>{barcodeResult}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>カメラ反転</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
```
