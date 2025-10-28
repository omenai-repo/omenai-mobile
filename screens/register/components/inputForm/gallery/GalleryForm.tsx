import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import GalleryWaitList from '../../galleryWaitlist/GalleryWaitList';
import GalleryRegisterForm from '../../galleryRegisterForm/GalleryRegisterForm';
import LongBlackButton from '../../../../../components/buttons/LongBlackButton';
import Input from '../../../../../components/inputs/Input';
import { UseGalleryAuthStore } from '../../../../../store/auth/login/galleryAuthStore';
import { useGalleryAuthRegisterStore } from 'store/auth/register/GalleryAuthRegisterStore';

export default function GalleryForm() {
  const { pageIndex } = useGalleryAuthRegisterStore();
  const [showWaitlistForm, setShowWaitlistForm] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      {showWaitlistForm ? <GalleryWaitList /> : <GalleryRegisterForm />}
      {pageIndex <= 0 && (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowWaitlistForm((prev) => !prev)}
        >
          <Text style={styles.toggleText}>
            {showWaitlistForm ? 'Register gallery account' : 'Join our waitlist'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    paddingBottom: 100,
  },
  toggleButton: {
    marginTop: 40,
    paddingVertical: 10,
  },
  toggleText: {
    textAlign: 'center',
    opacity: 0.8,
  },
});
