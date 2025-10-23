<<<<<<< HEAD
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
=======
import { View } from "react-native";
import React from "react";
import { getNumberOfColumns } from "utils/utils_screen";
import { MasonryFlashList } from "@shopify/flash-list";
import MiniArtworkCard from "./MiniArtworkCard";
import tw from "twrnc";

const renderLoaderItem = () => (
  <View style={tw`flex-1 items-center pb-5`}>
    <MiniArtworkCard />
  </View>
);

export default function MiniArtworkCardLoader() {
  const dummyArr = new Array(20).fill("loader");

  return (
    <View style={tw`flex-1`}>
>>>>>>> 9641e18ed4aa9701cebed1d5268dce601cf368f2
      <MasonryFlashList
        data={dummyArr}
        estimatedItemSize={20}
        onEndReachedThreshold={0.1}
<<<<<<< HEAD
        renderItem={() => (
          <View style={{ flex: 1, alignItems: 'center', paddingBottom: 20 }}>
            <Card />
          </View>
        )}
=======
        renderItem={renderLoaderItem}
>>>>>>> 9641e18ed4aa9701cebed1d5268dce601cf368f2
        keyExtractor={(_, index) => JSON.stringify(index)}
        showsVerticalScrollIndicator={false}
        numColumns={getNumberOfColumns()}
      />
    </View>
  );
}
<<<<<<< HEAD

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
=======
>>>>>>> 9641e18ed4aa9701cebed1d5268dce601cf368f2
