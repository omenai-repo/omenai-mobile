import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import omenaiLogo from '../../assets/omenai-logo.png';
import tailwind from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header({ showNotification = true }: { showNotification?: boolean }) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();

  const handleNotificationPress = () => {
    navigation.navigate('NotificationScreen');
  };

  return (
    <View style={[styles.mainContainer, { marginTop: insets.top + 16 }]}>
      <View style={tailwind`flex-1`}>
        <Image style={tailwind`w-[130px] h-[30px]`} resizeMode="contain" source={omenaiLogo} />
      </View>

      {showNotification && (
        <TouchableOpacity onPress={handleNotificationPress} activeOpacity={0.7}>
          <View
            style={tailwind`bg-[#f0f0f0] h-[40px] w-[40px] rounded-full flex items-center justify-center`}
          >
            <Ionicons name="notifications-outline" size={22} color="#1A1A1A" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
    gap: 20,
  },
});
