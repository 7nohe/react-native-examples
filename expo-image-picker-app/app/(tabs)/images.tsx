import { Image } from "expo-image";
import { FlatList, StyleSheet, View, Image as RNImage } from "react-native";

const data = new Array(999)
  .fill(null)
  .map((_, i) => `https://picsum.photos/seed/${i}/100/100`);

export default function Images() {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={3}
        initialNumToRender={10}
        renderItem={({ item }) => (
          // <RNImage source={{ uri: item }} style={{ width: 100, height: 100 }} />
          <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />
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
});
