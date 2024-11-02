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
