import { TextInput } from "@/components/TextInput";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Platform, View } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Button } from "@/components/Button";
import axios from "@/axios";

export default function AddReminder() {
  const { token } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 48,
        paddingHorizontal: 28,
        gap: 14,
      }}
    >
      <Stack.Screen
        options={{
          title: "Add Reminder",
        }}
      />
      <TextInput
        placeholder="Title"
        style={{
          width: "100%",
          height: 56,
          fontSize: 24,
          textAlign: "center",
        }}
        value={title}
        onChangeText={setTitle}
      />
      {Platform.OS === "android" && (
        <>
          <Button
            title={date.toLocaleDateString()}
            onPress={() => {
              DateTimePickerAndroid.open({
                value: date,
                onChange: (_, selectedTime) => {
                  setDate(selectedTime || date);
                },
                mode: "date",
                is24Hour: true,
              });
            }}
            style={{
              width: "100%",
            }}
            backgroundColor="#fff"
            textColor="#000"
          />
          <Button
            title={time.toLocaleTimeString()}
            onPress={() => {
              DateTimePickerAndroid.open({
                value: time,
                onChange: (_, selectedTime) => {
                  setTime(selectedTime || time);
                },
                mode: "time",
                is24Hour: true,
                minuteInterval: 10,
              });
            }}
            style={{
              width: "100%",
            }}
            backgroundColor="#fff"
            textColor="#000"
          />
        </>
      )}
      {Platform.OS === "ios" && (
        <DateTimePicker
          mode="datetime"
          value={time}
          minuteInterval={10}
          display="default"
          onChange={(_, selectedTime) => {
            setTime(selectedTime || time);
          }}
        />
      )}
      <View style={{ flexGrow: 1, justifyContent: "flex-end" }}>
        <Button
          title="Add Reminder"
          style={{
            width: "100%",
          }}
          disabled={loading}
          onPress={async () => {
            setLoading(true);
            try {
              await axios.post(
                "/reminders",
                {
                  title,
                  date: new Date(
                    `${date.toDateString()} ${time.toTimeString()}`
                  ),
                },
                {
                  headers: {
                    Authorization: token,
                  },
                }
              );
              router.back();
            } catch (e: unknown) {
              console.log(e);
            }
            setLoading(false);
          }}
        />
      </View>
    </View>
  );
}
