import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import InputForm from './inputForm/InputForm';
import { useGalleryAuthRegisterStore } from 'store/auth/register/GalleryAuthRegisterStore';
import { useArtistAuthRegisterStore } from 'store/auth/register/ArtistAuthRegisterStore';
import { useIndividualAuthRegisterStore } from 'store/auth/register/IndividualAuthRegisterStore';

export default function FormController() {
  const { pageIndex: collectorPage } = useIndividualAuthRegisterStore();
  const { pageIndex: artistPage } = useArtistAuthRegisterStore();
  const { pageIndex: galleryPage } = useGalleryAuthRegisterStore();

  const scrollViewRef = useRef<ScrollView>(null);

  // Reset ScrollView to top when any pageIndex changes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [collectorPage, artistPage, galleryPage]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollViewRef}
          nestedScrollEnabled={true}
          style={{ flexGrow: 1, paddingHorizontal: 20, marginTop: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <InputForm />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
