import { Button } from "@/components/Button";
import {
  DEFAULT_LONG_BREAK_TIME,
  DEFAULT_SHORT_BREAK_TIME,
  DEFAULT_WORK_TIME,
  loadSettings,
} from "@/libs/settings";
import { Ionicons } from "@expo/vector-icons";
import { useKeepAwake } from "expo-keep-awake";
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Text, View, Vibration, Pressable, Platform } from "react-native";

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
  const [settings, setSettings] = useState({
    workTime: DEFAULT_WORK_TIME,
    shortBreakTime: DEFAULT_SHORT_BREAK_TIME,
    longBreakTime: DEFAULT_LONG_BREAK_TIME,
  });

  const [seconds, setSeconds] = useState(settings.workTime);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(1);

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
      Vibration.vibrate(
        Platform.OS === "ios" ? [600, 600, 600] : [600, 400, 600, 400, 600, 400]
      );
      setIsActive(false);
      setIsBreak(false);
      setSeconds(settings.workTime);
    }

    // 作業中にタイマーが0になったとき
    if (seconds === 0 && !isBreak) {
      Vibration.vibrate(1000);
      // ポモドーロカウントを増やす
      setPomodoroCount((count) => count + 1);
      // 4回目の作業後は長い休憩
      startBreak(
        pomodoroCount % POMODORO_COUNT === 0
          ? settings.longBreakTime
          : settings.shortBreakTime
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
    setSeconds(settings.workTime);
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
