import { useState } from "react";
import { Button, View, StyleSheet, Alert, Text, FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

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
      <View style={{ marginVertical: 24 }}>
        <Button title="写真を追加" onPress={addPhoto} />
      </View>
      <FlatList
        data={images}
        numColumns={2}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />
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
