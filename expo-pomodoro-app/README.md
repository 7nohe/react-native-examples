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

app/index.tsx を以下のように書き換える。

```tsx
import { useKeepAwake } from "expo-keep-awake";
import React, { useState, useEffect } from "react";
import { Text, View, Vibration, Pressable, Platform } from "react-native";

const WORK_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
const LONG_BREAK_TIME = 15 * 60; // 15 minutes

const POMODORO_COUNT = 4;

function Button(
  props: {
    title: string;
    backgroundColor: string;
  } & React.ComponentProps<typeof Pressable>
) {
  const { backgroundColor, title } = props;
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
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

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
  const startBreak = (breakTine: number) => {
    setIsActive(true);
    setIsBreak(true);
    setSeconds(breakTine);
  };

  // 背景色を変更
  const getBackgroundColor = () => {
    if (isBreak) {
      return (pomodoroCount - 1) % POMODORO_COUNT === 0 ? "#FFD700" : "#ADD8E6";
    }
    return "#90EE90";
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: getBackgroundColor(),
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
