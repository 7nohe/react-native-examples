import { Button } from "@/components/Button";
import {
  DEFAULT_LONG_BREAK_TIME,
  DEFAULT_SHORT_BREAK_TIME,
  DEFAULT_WORK_TIME,
  loadSettings,
  saveSettings,
  SettingValues,
} from "@/libs/settings";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";

export default function Settings() {
  const [formValues, setFormValues] = useState<SettingValues>({
    workTime: DEFAULT_WORK_TIME,
    shortBreakTime: DEFAULT_SHORT_BREAK_TIME,
    longBreakTime: DEFAULT_LONG_BREAK_TIME,
  });

  useEffect(() => {
    // 設定を読み込む
    loadSettings().then((settings) => {
      if (settings) {
        setFormValues({
          workTime: settings.workTime ?? DEFAULT_WORK_TIME,
          shortBreakTime: settings.shortBreakTime ?? DEFAULT_SHORT_BREAK_TIME,
          longBreakTime: settings.longBreakTime ?? DEFAULT_LONG_BREAK_TIME,
        });
      }
    });
  }, []);

  const handleChange = (key: keyof SettingValues, value: string) => {
    const intValue = parseInt(value, 10);
    setFormValues((prev) => ({
      ...prev,
      [key]: intValue,
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>作業時間（秒）</Text>
        <TextInput
          value={
            isNaN(formValues.workTime) ? "" : formValues.workTime.toString()
          }
          keyboardType="number-pad"
          onChangeText={(text) => handleChange("workTime", text)}
          style={styles.input}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>短い休憩時間（秒）</Text>
        <TextInput
          value={
            isNaN(formValues.shortBreakTime)
              ? ""
              : formValues.shortBreakTime.toString()
          }
          keyboardType="number-pad"
          onChangeText={(text) => handleChange("shortBreakTime", text)}
          style={styles.input}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>長い休憩時間（秒）</Text>
        <TextInput
          value={
            isNaN(formValues.longBreakTime)
              ? ""
              : formValues.longBreakTime.toString()
          }
          keyboardType="number-pad"
          onChangeText={(text) => handleChange("longBreakTime", text)}
          style={styles.input}
        />
      </View>
      <View
        style={{
          marginTop: 48,
        }}
      >
        <Button
          title="保存する"
          backgroundColor="#007bff"
          textColor="#fff"
          disabled={
            isNaN(formValues.workTime) ||
            isNaN(formValues.shortBreakTime) ||
            isNaN(formValues.longBreakTime)
          }
          onPress={() => {
            saveSettings(formValues).then(() => {
              Alert.alert("保存しました");
            });
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  formGroup: {
    marginBottom: 20,
    flexDirection: "column",
    gap: 10,
  },
  label: {
    fontSize: 24,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
});
