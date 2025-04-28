import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import successCheck from '../../../assets/icons/success_check.png';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { uploadArtworkStore } from 'store/gallery/uploadArtworkStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';

export default function SuccessScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { clearData, artworkUploadData } = uploadArtworkStore();

  const handleClose = () => {
    clearData();
    navigation.goBack();
  };

  return (
    <View>
      <Text style={styles.title}>Upload successful</Text>
      <View style={styles.container}>
        <Text style={styles.mainText}>
          The Painting Of {artworkUploadData.title} has been successfully uploaded
        </Text>
        <Image source={successCheck} style={{ height: 100, width: 100, marginVertical: 30 }} />
        <LongBlackButton value="Return to overview" onClick={handleClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 18,
  },
  mainText: {
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 20,
    alignItems: 'center',
  },
});
