## Expo Image Picker App

## 環境

- Node.js: v20.16.0
- npm: v10.8.1

## 1. プロジェクトの作成

```bash
npx create-expo-app@latest expo-image-picker-app
cd expo-image-picker-app
npm run ios
# または
npm run android
```

不要なボイラープレートを削除する。

```bash
npm run reset-project
```

## 2. Expo Camera をインストール

```bash
npx expo install expo-image-picker
```

## 3. 写真ライブラリアクセス機能の実装

app/index.tsx:

```tsx
import { useState } from "react";
import { Button, Image, View, StyleSheet, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Index() {
  const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      // 本来は画像をアップロードする処理を書く
      setImages((images) => [result.assets[0].uri, ...images]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginVertical: 24 }}>
        <Button title="写真を追加" onPress={pickImage} />
      </View>
      <ScrollView>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
```

## 4. カメラから撮影した画像を取得する

```tsx
import { useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Index() {
  const [images, setImages] = useState<string[]>([]);
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();

  if (!permission) {
    // カメラパーミッションの読み込み中
    return <View />;
  }

  if (!permission.granted) {
    // カメラパーミッションが拒否された
    return (
      <View style={styles.container}>
        <Text>カメラのアクセス許可が必要です</Text>
        <Button onPress={requestPermission} title="許可する" />
      </View>
    );
  }

  // 省略

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      // 本来は画像をアップロードする処理を書く
      setImages((images) => [result.assets[0].uri, ...images]);
    }
  };

  const addPhoto = () => {
    Alert.alert("写真を追加", "カメラロールから写真を選択します", [
      { text: "キャンセル", style: "cancel" },
      { text: "ライブラリから写真を選択", onPress: pickImage },
      { text: "カメラで撮影", onPress: takePhoto },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={{ marginVertical: 24 }}>
        <Button title="写真を追加" onPress={addPhoto} />
      </View>
      {/* 省略 */}
    </View>
  );
}
```

## 5. Expo Image による画像表示最適化

```bash
npx expo install expo-image
```

```tsx
import { Image } from "expo-image";

// 省略

<FlatList
  data={images}
  numColumns={2}
  renderItem={({ item }) => (
    <Image source={{ uri: item }} style={styles.image} />
  )}
/>;
```
