import { Text, View } from "react-native";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { FontAwesome5 } from "@expo/vector-icons";
import LongBlackButton from "#components/buttons/LongBlackButton";

type PriceDisputeTriggerCardProps = {
  onPress: () => void;
};

export default function PriceDisputeTriggerCard({
  onPress,
}: Readonly<PriceDisputeTriggerCardProps>) {
  return (
    <View
      style={tw`bg-neutral-50 border border-neutral-200 rounded-sm p-4 mb-6`}
    >
      <Text
        style={[tw`text-sm font-sans-semibold mb-1`, { color: colors.black }]}
      >
        Do not agree with this listing price?
      </Text>
      <Text style={tw`text-xs text-neutral-500`}>
        You can override this baseline if supported by past sales data.
      </Text>
      <LongBlackButton
        value="Propose price"
        onClick={onPress}
        iconPosition="left"
        style={tw`mt-4 h-9 px-2.5`}
        textStyle={tw`text-xs font-sans-medium`}
        icon={
          <FontAwesome5 name="exchange-alt" size={14} color={colors.white} />
        }
      />
    </View>
  );
}
