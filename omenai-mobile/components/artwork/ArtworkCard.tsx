import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { formatPrice } from 'utils/priceFormatter';

type ArtworkCardType = {
    title: string,
    url: string,
    price: number,
    artist: string,
    rarity?: string,
    medium?: string,
    showPrice?: boolean,
    showTags?: boolean,
    fullDisplay?: boolean,
    lightText?: boolean
}

export default function ArtworkCard({title, url, artist, showPrice, price, fullDisplay, lightText}: ArtworkCardType) {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const screenWidth = Dimensions.get('window').width;

    const image_href = getImageFileView(url, 270);

    return (
        <TouchableOpacity activeOpacity={1} style={[styles.container, fullDisplay && {width: '100%', marginLeft: 0}]} onPress={() => navigation.navigate(screenName.artwork, {title: title})}>
            <View style={[styles.imageContainer, fullDisplay && {height: 300}]}>
                <Image source={{uri: image_href}} style={[styles.image, (fullDisplay || lightText) && {backgroundColor: 'rgba(225,225,225,0.1)'}]} resizeMode="contain"  />
            </View>
            <View style={styles.mainDetailsContainer}>
                <View style={{flex: 1}}>
                    <Text style={[{fontSize: 14, color: colors.primary_black}, lightText && {color: colors.white}]}>{title}</Text>
                    <Text style={[{fontSize: 12, color: colors.primary_black, opacity: 0.7, marginTop: 5}, lightText && {color: colors.white, opacity: 1}]}>{artist}</Text>
                    {showPrice && <Text style={[{fontSize: 14, color: colors.primary_black, fontWeight: '500', marginTop: 5}, lightText && {color: colors.white}]}>{formatPrice(price)}</Text>}
                </View>
                <Feather name='heart' size={20} color={lightText ? colors.white : colors.primary_black} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 270,
        marginLeft: 20
    },
    imageContainer: {
        width: '100%',
        height: 250
    },
    image: {
        height: '100%',
        width: '100%',
    },
    mainDetailsContainer: {
        marginTop: 10,
        flexDirection: 'row',
        gap: 10
    }
})