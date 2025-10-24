import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from 'config/colors.config';
import { Feather } from '@expo/vector-icons';

export default function CloseButton({ handlePress }: { handlePress: () => void }) {
  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <Feather name="x" color={colors.primary_black} size={17} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    width: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
});
