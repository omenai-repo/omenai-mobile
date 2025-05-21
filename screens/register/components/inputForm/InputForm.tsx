import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import AuthTabs from '../../../../components/auth/AuthTabs';
import IndividualForm from './individual/IndividualForm';
import GalleryForm from './gallery/GalleryForm';
import ArtistForm from './artist/ArtistForm';

export default function InputForm() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}>
      <AuthTabs
        tabs={['Collector', 'Artist', 'Gallery']}
        stateIndex={selectedIndex}
        handleSelect={(e) => setSelectedIndex(e)}
      />
      {selectedIndex === 0 && <IndividualForm />}
      {selectedIndex === 1 && <ArtistForm />}
      {selectedIndex === 2 && <GalleryForm />}
    </View>
  );
}
