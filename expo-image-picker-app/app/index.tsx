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
import { Stack } from "expo-router";

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
      <Stack.Screen
        options={{
          title: "ホーム",
          headerRight: () => <Button title="写真を追加" onPress={addPhoto} />,
        }}
      />
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
