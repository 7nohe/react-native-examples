import AsyncStorage from "@react-native-async-storage/async-storage";

export const DEFAULT_WORK_TIME = 25 * 60; // 作業時間のデフォルト値（25分）
export const DEFAULT_SHORT_BREAK_TIME = 5 * 60; // 短い休憩時間のデフォルト値（5分）
export const DEFAULT_LONG_BREAK_TIME = 15 * 60; // 長い休憩時間のデフォルト値（15分）

const STORAGE_KEY = "settings";

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
    const settings = await AsyncStorage.getItem(STORAGE_KEY);
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
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error(error);
  }
}
