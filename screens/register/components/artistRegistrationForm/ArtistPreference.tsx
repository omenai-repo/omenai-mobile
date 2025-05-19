import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../../../../config/colors.config';
import NextButton from '../../../../components/buttons/NextButton';
import { mediumListing } from 'data/uploadArtworkForm.data';
import tw from 'twrnc';
import { useArtistAuthRegisterStore } from 'store/auth/register/ArtistAuthRegisterStore';
import BackFormButton from 'components/buttons/BackFormButton';

type TabItemProps = {
  name: string;
  isSelected: boolean;
  onSelect: () => void;
};

const ArtistPreference = () => {
  const { pageIndex, setPageIndex, artistRegisterData, setArtStyles } =
    useArtistAuthRegisterStore();

  const handleSelect = (value: string) => {
    if (artistRegisterData.art_style.includes(value)) {
      let arr = [...artistRegisterData.art_style];
      let index = arr.indexOf(value);
      arr.splice(index, 1);
      setArtStyles(arr);
    } else if (artistRegisterData.art_style.length < 1) {
      setArtStyles([...artistRegisterData.art_style, value]);
    }
  };

  const TabItem = ({ name, isSelected, onSelect }: TabItemProps) => {
    if (isSelected)
      return (
        <TouchableOpacity
          style={[styles.tabItem, styles.selectedTabItem]}
          activeOpacity={0.7}
          onPress={onSelect}
        >
          <Text style={{ fontSize: 12, color: '#fff' }}>{name}</Text>
        </TouchableOpacity>
      );

    return (
      <TouchableOpacity style={styles.tabItem} activeOpacity={0.7} onPress={onSelect}>
        <Text style={{ fontSize: 12, color: '#1a1a1a' }}>{name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Text style={tw`text-[#1A1A1A] text-[20px] font-medium`}>Select your art style</Text>
      <View style={styles.tabsContainer}>
        {mediumListing.map((i, idx) => (
          <TabItem
            name={i.value}
            key={idx}
            onSelect={() => handleSelect(i.value)}
            isSelected={artistRegisterData.art_style.includes(i.value)}
          />
        ))}
      </View>

      <View style={tw`flex-row mt-[60px]`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <View style={{ flex: 1 }} />
        <NextButton
          isDisabled={artistRegisterData.art_style.length < 1}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.primary_black,
    fontSize: 16,
  },
  tabsContainer: {
    marginTop: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 25,
    columnGap: 10,
  },
  tabItem: {
    height: 40,
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTabItem: {
    backgroundColor: colors.black,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 40,
  },
});

export default ArtistPreference;
