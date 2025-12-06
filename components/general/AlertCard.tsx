import React from "react";
import { View, Text, ViewStyle } from "react-native";
import tw from "twrnc";
import { Feather } from "@expo/vector-icons";
import { colors } from "config/colors.config";

interface AlertCardProps {
  title: string;
  description: string;
  iconName?: keyof typeof Feather.glyphMap;
  iconColor?: string;
  titleColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  descriptionColor?: string;
  style?: ViewStyle;
}

const AlertCard: React.FC<AlertCardProps> = ({
  title,
  description,
  iconName = "alert-circle",
  iconColor = "#FA5252",
  titleColor = "#FA5252",
  borderColor = "#FA5252",
  backgroundColor = "#FA52521A",
  descriptionColor = colors.black,
  style,
}) => {
  return (
    <View
      style={[
        tw`rounded-xl relative overflow-hidden mb-3 p-4`,
        {
          borderWidth: 2,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        },
        style,
      ]}
    >
      <View style={tw`flex gap-2 flex-row items-center`}>
        <Feather name={iconName} size={30} color={iconColor} />

        <Text
          style={[
            tw`text-sm`,
            {
              color: titleColor,
              fontWeight: "700",
            },
          ]}
        >
          {title}
        </Text>
      </View>
      <View style={[tw`pt-2.5 pl-0`]}>
        <Text style={[tw`text-sm leading-6`, { color: descriptionColor }]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

export default AlertCard;
