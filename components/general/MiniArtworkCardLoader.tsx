import { StyleSheet, View } from 'react-native';
import React from 'react';
import { getNumberOfColumns } from 'utils/utils_screen';
import { MasonryFlashList } from '@shopify/flash-list';
import tailwind from 'twrnc';

export default function MiniArtworkCardLoader() {
  const dummyArr = new Array(20).fill('loader');

  const Card = () => {
    return (
      <View style={tailwind`px-[10px] w-full`}>
        <View style={styles.imageContainer} />
        <View style={styles.mainDetailsContainer}>
          <View style={{ flex: 1 }}>
            <View style={{ height: 10, width: '100%', backgroundColor: '#eee' }} />
            <View style={{ height: 10, marginTop: 10, width: '50%', backgroundColor: '#eee' }} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={dummyArr}
        estimatedItemSize={20}
        onEndReachedThreshold={0.1}
        renderItem={() => (
          <View style={{ flex: 1, alignItems: 'center', paddingBottom: 20 }}>
            <Card />
          </View>
        )}
        keyExtractor={(_, index) => JSON.stringify(index)}
        showsVerticalScrollIndicator={false}
        numColumns={getNumberOfColumns()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#eee',
  },
  mainDetailsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
});
