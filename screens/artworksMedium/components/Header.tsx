import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Platform, StatusBar} from 'react-native'
import React from 'react';
import BackScreenButton from 'components/buttons/BackScreenButton';

type HeaderProps = {
    image: string,
    goBack: () => void
}

export default function Header({image, goBack}: HeaderProps) {
    return (
        <ImageBackground source={image} alt=''>
            <SafeAreaView style={styles.safeArea}>
                <View style={{paddingHorizontal: 20, paddingBottom: 20}}>
                    <BackScreenButton handleClick={goBack} />
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }
})