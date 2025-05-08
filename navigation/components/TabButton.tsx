import { colors } from 'config/colors.config';
import { GestureResponderEvent, Text, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import tw from 'twrnc';

const TabButton = ({
  name,
  activeIcon,
  inActiveIcon,
  accessibilityState,
  onPress,
}: {
  name: string;
  activeIcon: string;
  inActiveIcon: string;
  accessibilityState?: any;
  onPress?: (event: GestureResponderEvent) => void;
}) => {
  const focused = accessibilityState?.selected;
  return (
    <TouchableOpacity
      onPress={(event) => onPress?.(event)}
      activeOpacity={1}
      style={tw`items-center flex-1 justify-center`}
    >
      <SvgXml xml={focused ? activeIcon : inActiveIcon} />
      <Text
        style={[
          { fontSize: 13, color: colors.grey, fontWeight: '700', marginTop: 10 },
          focused && { color: colors.white },
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default TabButton;
