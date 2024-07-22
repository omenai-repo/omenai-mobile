import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { formatPrice } from 'utils/priceFormatter';
import LikeComponent from './LikeComponent';

type ArtworkCardType = {
    title: string,
    url: string,
    price: number,
    artist: string,
    rarity?: string,
    medium?: string,
    showPrice?: boolean,
    availiablity?: boolean,
    showTags?: boolean,
    lightText?: boolean,
    width?: number,
    art_id: string;
    impressions: number;
    like_IDs: string[];
    galleryView?: boolean
}

export default function ArtworkCard({title, url, artist, showPrice, price, lightText, width = 0, impressions, art_id, like_IDs, galleryView = false, availiablity}: ArtworkCardType) {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const screenWidth = Dimensions.get('window').width;

    const image_href = getImageFileView(url, 270);

    return (
        <TouchableOpacity activeOpacity={1} style={[styles.container, width > 0 && {width: width}]} onPress={() => {
            navigation.navigate(screenName.artwork, {title: title})
        }}>
            <View style={[styles.imageContainer, lightText && {backgroundColor: 'rgba(225,225,225,0.15)', padding: 15}]}>
                <Image source={{uri: image_href}} style={styles.image} resizeMode="contain" />
            </View>
            <View style={styles.mainDetailsContainer}>
                <View style={{flex: 1}}>
                    <Text style={[{fontSize: 14, color: colors.primary_black}, lightText && {color: colors.white}]}>{title}</Text>
                    <Text style={[{fontSize: 12, color: colors.primary_black, opacity: 0.7, marginTop: 5}, lightText && {color: colors.white, opacity: 1}]}>{artist}</Text>
                    {galleryView ? 
                        <Text style={[{fontSize: 12, color: colors.primary_black, marginTop: 5}, lightText && {color: colors.white}]}>{impressions} impressions</Text>
                        :
                        (!availiablity ? 
                            <Text style={[{fontSize: 14, color: colors.primary_black, opacity: 0.7, marginTop: 5}, lightText && {color: colors.white}]}>Sold</Text> 
                            : 
                            <Text style={[{fontSize: 14, color: colors.primary_black, fontWeight: '500', marginTop: 5}, lightText && {color: colors.white}]}>{showPrice ? formatPrice(price) : "Price on request"}</Text>
                        )
                    }
                </View>
                {!galleryView &&
                    <LikeComponent
                        art_id={art_id}
                        impressions={impressions || 0}
                        likeIds={like_IDs || []}
                        lightText={lightText}
                    />
                }
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