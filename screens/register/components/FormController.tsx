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
  return <InputForm />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
