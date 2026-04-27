import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import sortIcon from "../../assets/icons/sort-icon.png";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "#constants/screenNames.constants";
import tw from "twrnc";

type FilterButtonProps = {
  children?: React.ReactNode;
  handleClick?: () => void;
};

export default function FilterButton({
  children,
  handleClick,
}: Readonly<FilterButtonProps>) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={tw`flex-row items-center gap-2.5`}>
      <View style={{ flex: 1 }}>{children}</View>
      <TouchableOpacity
        onPress={() => {
          if (handleClick) {
            handleClick();
          } else {
            navigation.navigate(screenName.filter);
          }
        }}
      >
        <View
          style={tw`flex-row items-center gap-2 px-2.5 py-1.5 rounded-sm border border-neutral-200`}
        >
          <Text
            style={[
              tw`text-sm uppercase text-center font-sans-regular`,
              { color: colors.primary_black },
            ]}
          >
            Filter
          </Text>
          <Image
            source={sortIcon}
            style={tw`h-[18px] w-[18px] opacity-70`}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
