import { COLORS } from "@/constants/theme";
import { TextInput as RNTextInput } from "react-native";

export function TextInput(
  props: {
    backgroundColor?: string;
    textColor?: string;
  } & React.ComponentProps<typeof RNTextInput>
) {
  const { backgroundColor = COLORS.white, textColor = COLORS.black } = props;
  return (
    <RNTextInput
      {...props}
      style={[
        {
          backgroundColor,
          color: textColor,
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          borderColor: COLORS.grey,
        },
        props.style,
      ]}
    />
  );
}
