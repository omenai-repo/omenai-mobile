import { colors } from "config/colors.config";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { rightArrowIcon, getRightArrowIcon } from "utils/SvgImages";
import tw from "twrnc";

type PageButtonItemProps = {
  name: string;
  subText?: string;
  handlePress: () => void;
  logout?: boolean;
  children?: React.ReactNode;
  svgIcon?: string;
  Icon?: React.ReactNode;
  variant?: "default" | "danger";
};

export const PageButtonCard = ({
  name,
  subText,
  handlePress,
  logout,
  children,
  svgIcon,
  Icon,
  variant = "default",
}: PageButtonItemProps) => {
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <View style={tw`p-5 flex-row items-center gap-[10px]`}>
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center gap-[15px]`}>
            {!svgIcon ? Icon : <SvgXml xml={svgIcon} />}
            <Text
              style={[
                tw`text-base font-medium`,
                { color: logout || isDanger ? "#DC2626" : colors.primary_black },
              ]}
            >
              {name}
            </Text>
          </View>
          {subText && (
            <Text style={[tw`text-sm mt-[10px]`, { color: isDanger ? "#991B1B" : "#00000099" }]}>
              {subText}
            </Text>
          )}
        </View>
        {children ? (
          children
        ) : (
          <SvgXml xml={isDanger ? getRightArrowIcon("#DC2626") : rightArrowIcon} />
        )}
      </View>
    </TouchableOpacity>
  );
};
