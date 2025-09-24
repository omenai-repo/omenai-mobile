import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import React from 'react';
import BackScreenButton from 'components/buttons/BackScreenButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { colors } from 'config/colors.config';
import { Feather } from '@expo/vector-icons';
import { screenName } from 'constants/screenNames.constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ArtworkHeaderProps = {
  isGallery: boolean;
  art_id: string | undefined;
};

export default function Header({ isGallery, art_id }: ArtworkHeaderProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 16,
      }}
    >
      <View style={{ paddingHorizontal: 20, flexDirection: 'row' }}>
        <BackScreenButton handleClick={() => navigation.goBack()} />
        <View style={{ flex: 1 }} />
        {isGallery && art_id && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (!art_id) return;
              navigation.navigate(screenName.gallery.editArtwork, {
                art_id: art_id,
              });
            }}
          >
            <View style={styles.container}>
              <Feather name="edit-2" color={colors.primary_black} size={16} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
});
