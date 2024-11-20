import { router, Stack, useFocusEffect } from "expo-router";
import { FlatList, Platform, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "@/axios";

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get token.");
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      console.log("No project ID found.");
      return;
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      console.log(e);
    }
  } else {
    console.log("Must use physical device for Push Notifications");
  }
}

type Reminder = {
  id: string;
  title: string;
  date: string;
};

async function fetchReminders(token: string) {
  const headers = {
    Authorization: token,
  };
  try {
    const userRes = await axios.get("/me", {
      headers,
    });
    const user = userRes.data as { id: string; token: string };

    if (user) {
      const remindersRes = await axios.get("/reminders", {
        headers,
      });
      return remindersRes.data as Reminder[];
    } else {
      await axios.post("/users", {
        token,
      });
    }
  } catch (e: unknown) {
    console.error(e);
  }
  return [];
}

export default function Index() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!expoPushToken) {
        return;
      }
      const fetchRemindersAsync = async () => {
        setLoading(true);
        const reminders = await fetchReminders(expoPushToken);
        setLoading(false);
        setReminders(reminders);
      };
      fetchRemindersAsync();
    }, [expoPushToken])
  );

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      setExpoPushToken(token ?? "");
      if (token) {
        setLoading(true);
        const reminders = await fetchReminders(token);
        setLoading(false);
        setReminders(reminders);
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack.Screen
        options={{
          title: "Simple Reminder",
          headerRight: () => (
            <Pressable
              onPressIn={() =>
                router.push({
                  pathname: "/[token]/add-reminder",
                  params: {
                    token: expoPushToken,
                  },
                })
              }
            >
              <Ionicons name="add" size={24} />
            </Pressable>
          ),
        }}
      />
      <FlatList
        data={reminders}
        refreshing={loading}
        onRefresh={async () => {
          setLoading(true);
          const reminders = await fetchReminders(expoPushToken);
          setLoading(false);
          setReminders(reminders);
        }}
        contentContainerStyle={{
          width: "100%",
          paddingHorizontal: 28,
          paddingVertical: 14,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 14,
              borderBottomColor: "#000",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: 14,
              flex: 1,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 14,
              }}
            >
              <Text>{item.title}</Text>
              <Text>{new Date(item.date).toLocaleString()}</Text>
            </View>
            <Pressable
              onPress={() => {
                axios.delete(`/reminders/${item.id}`, {
                  headers: {
                    Authorization: expoPushToken,
                  },
                });
                setReminders((prev) =>
                  prev.filter((reminder) => reminder.id !== item.id)
                );
              }}
            >
              <Ionicons name="trash" size={24} />
            </Pressable>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
