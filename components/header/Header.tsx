import { Image, StyleSheet, View, SafeAreaView, Text } from "react-native";
import React from "react";
import { colors } from "../../config/colors.config";

import omenaiLogo from '../../assets/omenai-logo.png';
import tailwind from 'twrnc';
import { fontNames } from 'constants/fontNames.constants';

export default function Header({showNotification}: {showNotification?: boolean}) {
    

    return (
        <SafeAreaView>
            <View style={styles.mainContainer}>
                <View style={tailwind`flex-1`}>
                    <Image style={tailwind`w-[130px] h-[30px]`} resizeMode='contain' source={omenaiLogo} />
                </View>
                <View style={tailwind`bg-[#f0f0f0] h-[40px] w-[40px] rounded-full flex items-center justify-center`}>
                    <Text style={[tailwind`text-sm font-bold text-center`, {fontFamily: fontNames.dmSans + 'Bold'}]}>MC</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    alignSelf: "center",
    gap: 20,
  },
});
