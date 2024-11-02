## Expo Image Picker App

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

## 2. Async Storage と Expo KeepAwake をインストール

```bash
npx expo install @react-native-async-storage/async-storage expo-keep-awake
```

## 3. ポモドーロタイマーの実装

### 3.1 ボタンコンポーネントの作成

components/Button.tsx を以下のように作成する。

```tsx
import { Pressable, Text } from "react-native";

export function Button(
  props: {
    title: string;
    backgroundColor: string;
    textColor?: string;
  } & React.ComponentProps<typeof Pressable>
) {
  const { backgroundColor, title, textColor = "#000" } = props;
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "darkgray" : backgroundColor,
          padding: 10,
          borderRadius: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: props.disabled ? 0.5 : 1,
        },
      ]}
    >
      <Text
        style={{
          fontSize: 24,
          color: textColor,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
```

### 3.2 タイマー画面の作成

app/index.tsx を以下のように書き換える。

```tsx
import { Button } from "@/components/Button";
import { useKeepAwake } from "expo-keep-awake";
import React, { useState, useEffect } from "react";
import { Text, View, Vibration, Pressable, Platform } from "react-native";

const WORK_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
const LONG_BREAK_TIME = 15 * 60; // 15 minutes

const POMODORO_COUNT = 4;

// 秒をmm:ss形式に変換
function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export default function Index() {
  useKeepAwake(); // スリープを防ぐ

  const [seconds, setSeconds] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    // タイマーが稼働中
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    }

    // タイマーが停止中
    if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    // 休憩中にタイマーが0になったとき
    if (seconds === 0 && isBreak) {
      Vibration.vibrate(Platform.OS === "ios" ? [1000, 1000, 1000] : 3000);
      setIsActive(false);
      setIsBreak(false);
      setSeconds(WORK_TIME);
    }

    // 作業中にタイマーが0になったとき
    if (seconds === 0 && !isBreak) {
      Vibration.vibrate(1000);
      // ポモドーロカウントを増やす
      setPomodoroCount((count) => count + 1);
      // 4回目の作業後は長い休憩
      startBreak(
        pomodoroCount % POMODORO_COUNT === 0
          ? LONG_BREAK_TIME
          : SHORT_BREAK_TIME
      );
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, isBreak, pomodoroCount]);

  // タイマーを開始
  const startTimer = () => {
    setIsActive(true);
  };

  // タイマーを停止
  const stopTimer = () => {
    setIsActive(false);
  };

  // タイマーをリセット
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(WORK_TIME);
    setIsBreak(false);
    setPomodoroCount(1);
  };

  // 休憩を開始
  const startBreak = (breakTime: number) => {
    setIsActive(true);
    setIsBreak(true);
    setSeconds(breakTime);
  };

  // 背景色を変更
  const backgroundColor = useMemo(() => {
    if (isBreak) {
      return (pomodoroCount - 1) % POMODORO_COUNT === 0 ? "#FFD700" : "#ADD8E6";
    }
    return "#90EE90";
  }, [isBreak, pomodoroCount]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor,
        gap: 20,
      }}
    >
      <Text style={{ fontSize: 24 }}>
        {isBreak ? "休憩" : `作業 ${pomodoroCount}`}
      </Text>
      <Text style={{ fontSize: 64 }}>{formatTime(seconds)}</Text>
      <View
        style={{
          marginTop: 20,
          width: "50%",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <Button
          title="START"
          onPress={startTimer}
          backgroundColor="skyblue"
          disabled={isActive}
        />
        <Button
          title="STOP"
          onPress={stopTimer}
          backgroundColor="tomato"
          disabled={!isActive}
        />
        <Button title="RESET" onPress={resetTimer} backgroundColor="white" />
      </View>
    </View>
  );
}
```

### 3.3 アプリの起動

アプリを起動して、ポモドーロタイマーが正常に動作することを確認する。

```bash
npm run ios
# または
npm run android
```

## 4. 設定機能の追加

### 4.1 ストレージから設定値を保存/取得処理を追加

libs/settings.ts を以下のように作成する。

```ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const DEFAULT_WORK_TIME = 25 * 60; // 作業時間のデフォルト値（25分）
export const DEFAULT_SHORT_BREAK_TIME = 5 * 60; // 短い休憩時間のデフォルト値（5分）
export const DEFAULT_LONG_BREAK_TIME = 15 * 60; // 長い休憩時間のデフォルト値（15分）

export type SettingValues = {
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
};

/**
 * 設定値をAsyncStorageから読み込む
 * @returns 設定値
 */
export async function loadSettings(): Promise<SettingValues | null> {
  try {
    const settings = await AsyncStorage.getItem("settings");
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * 設定値をAsyncStorageに保存する
 * @param settings 設定値
 */
export async function saveSettings(settings: SettingValues) {
  try {
    await AsyncStorage.setItem("settings", JSON.stringify(settings));
  } catch (error) {
    console.error(error);
  }
}
```

### 4.2 設定画面の作成

app/settings.tsx を以下のように作成する。

```tsx
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
```

### 4.3 タイマー画面に設定値を反映させる

app/index.tsx を以下のように書き換える。

```tsx
import {
  DEFAULT_LONG_BREAK_TIME,
  DEFAULT_SHORT_BREAK_TIME,
  DEFAULT_WORK_TIME,
  loadSettings,
} from "@/libs/settings";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";

// 省略

// const WORK_TIME = 25 * 60;  <- 削除
// const SHORT_BREAK_TIME = 5 * 60; <- 削除
// const LONG_BREAK_TIME = 15 * 60; <- 削除

export default function Index() {
  const [settings, setSettings] = useState({
    workTime: DEFAULT_WORK_TIME,
    shortBreakTime: DEFAULT_SHORT_BREAK_TIME,
    longBreakTime: DEFAULT_LONG_BREAK_TIME,
  });

  const [seconds, setSeconds] = useState(settings.workTime); // <- 修正

  // 省略

  useFocusEffect(
    useCallback(() => {
      // 設定を読み込む
      loadSettings().then((settings) => {
        if (settings) {
          setSettings(settings);
          setSeconds(settings.workTime);
        }
      });
    }, [])
  );

  useEffect(() => {
    //  省略

    // 休憩中にタイマーが0になったとき
    if (seconds === 0 && isBreak) {
      // 省略
      setSeconds(settings.workTime); // <- 修正
    }

    // 作業中にタイマーが0になったとき
    if (seconds === 0 && !isBreak) {
      // 省略

      // 4回目の作業後は長い休憩
      startBreak(
        pomodoroCount % POMODORO_COUNT === 0
          ? settings.longBreakTime // <- 修正
          : settings.shortBreakTime // <- 修正
      );
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, isBreak, pomodoroCount]);

  // 省略

  // タイマーをリセット
  const resetTimer = () => {
    // 省略
    setSeconds(settings.workTime); // <- 修正
  };

  // 省略

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor,
        gap: 20,
      }}
    >
      {/* ↓追加 */}
      <Stack.Screen
        options={{
          title: "Pomodoro Timer",
          headerRight: () => (
            <Pressable onPress={() => router.navigate("/settings")}>
              <Ionicons name="settings-outline" size={24} color="black" />
            </Pressable>
          ),
          headerStyle: { backgroundColor },
        }}
      />

      {/* 省略 */}
    </View>
  );
}
```
