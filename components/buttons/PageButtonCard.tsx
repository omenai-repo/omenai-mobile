import { colors } from 'config/colors.config';
import { Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { rightArrowIcon } from 'utils/SvgImages';
import tw from 'twrnc';

type PageButtonItemProps = {
  name: string;
  subText?: string;
  handlePress: () => void;
  logout?: boolean;
  children?: React.ReactNode;
  svgIcon?: string;
  Icon?: React.ReactNode;
};

export const PageButtonCard = ({
  name,
  subText,
  handlePress,
  logout,
  children,
  svgIcon,
  Icon,
}: PageButtonItemProps) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <View style={tw`p-5 flex-row items-center gap-[10px]`}>
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center gap-[15px]`}>
            {!svgIcon ? Icon : <SvgXml xml={svgIcon} />}
            <Text
              style={[
                tw`text-base`,
                { color: logout ? '#ff0000' : colors.primary_black },
              ]}
            >
              {name}
            </Text>
          </View>
          {subText && (
            <Text style={tw`text-sm text-[#00000099] mt-[10px]`}>{subText}</Text>
          )}
        </View>
        {children ? children : <SvgXml xml={rightArrowIcon} />}
      </View>
    </TouchableOpacity>
  );
};
