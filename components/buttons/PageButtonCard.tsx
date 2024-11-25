import { Feather } from "@expo/vector-icons";
import { colors } from "config/colors.config";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { rightArrowIcon, savedArtworksIcon } from "utils/SvgImages";
import tw from "twrnc";

type PageButtonItemProps = {
  name: string;
  subText?: string;
  handlePress: () => void;
  logout?: boolean;
  children?: React.ReactNode;
  svgIcon: string;
};

export const PageButtonCard = ({
  name,
  subText,
  handlePress,
  logout,
  children,
  svgIcon,
}: PageButtonItemProps) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <View style={[styles.pageButtonItem]}>
        <View style={{ flex: 1 }}>
          <View style={tw`flex-row items-center gap-[15px]`}>
            <SvgXml xml={svgIcon} />
            <Text
              style={[
                { fontSize: 16, color: colors.primary_black },
                logout && { color: "#ff0000" },
              ]}
            >
              {name}
            </Text>
          </View>
          {subText && (
            <Text style={{ fontSize: 14, color: "#00000099", marginTop: 10 }}>
              {subText}
            </Text>
          )}
        </View>
        {children ? children : <SvgXml xml={rightArrowIcon} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pageButtonItem: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
