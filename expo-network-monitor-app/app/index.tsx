import { Button, StyleSheet, Text, View } from "react-native";
import { isOnline, isWifi } from "../modules/network-monitor-module";
import { useState } from "react";

export default function Index() {
  const [online, setOnline] = useState<boolean>(isOnline());
  const [wifi, setWifi] = useState<boolean>(isWifi());
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          {
            color: online ? "green" : "red",
          },
        ]}
      >
        {online ? "オンラインです" : "オフラインです"}
      </Text>
      <Text
        style={[
          styles.text,
          {
            color: wifi ? "green" : "red",
          },
        ]}
      >
        Wifi: {wifi ? "接続中" : "未接続"}
      </Text>
      <Button
        title="更新"
        onPress={() => {
          setOnline(isOnline());
          setWifi(isWifi());
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
});
