import React from "react";
import { View } from "react-native";
import tw from "twrnc";
import { colors } from "config/colors.config";
import { PageButtonCard } from "components/buttons/PageButtonCard";

export type ProfileMenuItem = {
  name: string;
  subText?: string;
  handlePress: () => void;
  svgIcon?: string;
  Icon?: React.ReactNode;
};

type ProfileMenuItemsProps = {
  items: ProfileMenuItem[];
  containerStyle?: any;
};

export default function ProfileMenuItems({
  items,
  containerStyle,
}: ProfileMenuItemsProps) {
  return (
    <View style={containerStyle}>
      {items.map((item, index) => (
        <React.Fragment key={item.name}>
          <PageButtonCard
            name={item.name}
            subText={item.subText}
            handlePress={item.handlePress}
            svgIcon={item.svgIcon}
            Icon={item.Icon}
          />
          {index < items.length - 1 && (
            <View style={tw`h-px mx-5 bg-[${colors.grey50}]`} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}
