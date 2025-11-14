import { Pressable, Text } from "react-native";
import tw from "twrnc";
import { colors } from "config/colors.config";

type SelectableTagProps = {
  name: string;
  isSelected: boolean;
  onSelect: () => void;
};

export default function SelectableTag({ name, isSelected, onSelect }: SelectableTagProps) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        tw`h-10 px-5 rounded-lg border items-center justify-center`,
        { borderColor: colors.inputBorder },
        isSelected ? { backgroundColor: colors.black } : { backgroundColor: "#FAFAFA" },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <Text style={[tw`text-xs`, { color: isSelected ? colors.white : colors.primary_black }]}>
        {name}
      </Text>
    </Pressable>
  );
}
