import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import BackScreenButton from 'components/buttons/BackScreenButton';
import { colors } from 'config/colors.config';
import { uploadArtworkStore } from 'store/artworks/UploadArtworkStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export default function HeaderIndicator() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const {activeIndex, setActiveIndex} = uploadArtworkStore();

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <BackScreenButton 
                    handleClick={() => {
                        if(activeIndex === 1){
                            navigation.goBack()
                        }else{
                            setActiveIndex(activeIndex - 1)
                        }
                    }} 
                    cancle={activeIndex === 1}
                />
                <Text style={styles.topTitle}>
                    {activeIndex === 1 && 'Upload artwork'}
                    {activeIndex === 2 && 'Artwork details'}
                    {activeIndex === 3 && 'Artist details'}
                </Text>
                <View style={{width: 50}} />
            </View>
            <View style={styles.indicatorContainer}>
                {[1,2,3].map(index => (
                    <View key={index} style={[styles.indicator, activeIndex >= index && {backgroundColor: '#000'}]} />
                ))}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    indicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 20,
        marginTop: 20
    },
    indicator: {
        height: 4,
        flex: 1,
        borderRadius: 2,
        backgroundColor: '#eee'
    },
    topTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        color: colors.primary_black
    }
})