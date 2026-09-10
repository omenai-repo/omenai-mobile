import { StyleSheet, Text, View } from "react-native";
import React from "react";
import BackScreenButton from "#components/buttons/BackScreenButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { colors } from "#config/colors.config";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDevice } from "#hooks/useDevice";
import tw from "#lib/tailwind";

type BackHeaderTitleProps = {
  title: string;
  callBack?: () => void;
  customGoBack?: () => void;
  rightAction?: React.ReactNode;
};

export default function BackHeaderTitle({
  title,
  callBack,
  customGoBack,
  rightAction,
}: Readonly<BackHeaderTitleProps>) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const { isTablet } = useDevice();

  return (
    <View
      style={{
        paddingTop: insets.top + (isTablet ? 15 : 10),
      }}
    >
      <View
        style={[styles.topContainer, isTablet && { paddingHorizontal: 40 }]}
      >
        <BackScreenButton
          handleClick={() => {
            if (customGoBack) {
              customGoBack();
            } else {
              navigation.goBack();
              callBack && callBack();
            }
          }}
        />
        <Text
          style={[
            tw`font-sans-medium flex-1 text-center capitalize`,
            styles.topTitle,
            isTablet && { fontSize: 20 },
          ]}
        >
          {title}
        </Text>
        <View style={{ width: isTablet ? 60 : 50, alignItems: "flex-end" }}>
          {rightAction}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  topTitle: {
    fontSize: 16,
    color: colors.primary_black,
  },
});
