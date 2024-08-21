import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { colors } from 'config/colors.config';

export default function ViewHistoryCard({
    url,
    art_id,
    artist,
    artwork
}:{
    url: string,
    art_id: string,
    artwork: string,
    artist: string
}) {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const image_href = getImageFileView(url, 270);

    return (
        <TouchableOpacity activeOpacity={1} style={styles.container} onPress={() => {
            navigation.navigate(screenName.artwork, {title: artwork})
        }}>
            <View style={styles.imageContainer}>
                <Image source={{uri: image_href}} style={styles.image} resizeMode="contain" />
            </View>
            <View style={styles.mainDetailsContainer}>
                <Text style={{fontSize: 14, color: colors.primary_black}}>{artwork}</Text>
                <Text style={{fontSize: 12, color: colors.primary_black, opacity: 0.7, marginTop: 5}}>{artist}</Text>
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
    }
})