import {
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import { colors } from '../../config/colors.config';

import omenaiLogo from '../../assets/omenai-logo.png';
import tailwind from 'twrnc';
import { fontNames } from '../../constants/fontNames.constants';
import { useAppStore } from 'store/app/appStore';
import { utils_getInitials } from 'utils/utils_sortFunctions';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { screenName } from 'constants/screenNames.constants';

export default function Header({ showNotification }: { showNotification?: boolean }) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { userSession } = useAppStore();
  const handleNavigation = () => {
    if (userSession.role === 'gallery') {
      //navigate to gallery profile screen
      navigation.navigate(screenName.gallery.profile);
      return;
    }

    if (userSession.role === 'artist') {
      //navigate to gallery profile screen
      navigation.navigate(screenName.gallery.profile);
      return;
    }
    navigation.navigate(screenName.profile);
  };

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View style={tailwind`flex-1`}>
          <Image style={tailwind`w-[130px] h-[30px]`} resizeMode="contain" source={omenaiLogo} />
        </View>
        <TouchableOpacity onPress={handleNavigation} activeOpacity={0.7}>
          <View
            style={tailwind`bg-[#f0f0f0] h-[40px] w-[40px] rounded-full flex items-center justify-center`}
          >
            <Text
              style={[
                tailwind`text-sm font-bold text-center`,
                { fontFamily: fontNames.dmSans + 'Bold' },
              ]}
            >
              {utils_getInitials(userSession?.name)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
    gap: 20,
    marginTop: 5,
  },
});
