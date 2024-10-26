import { useState } from "react";
import { Button, Image, View, StyleSheet, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";

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
      <Stack.Screen
        options={{
          title: "ホーム",
          headerRight: () => <Button title="写真を選択" onPress={pickImage} />,
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
