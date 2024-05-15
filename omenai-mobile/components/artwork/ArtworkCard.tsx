import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import { getImageFileView } from 'lib/storage/getImageFileView';

type ArtworkCardType = {
    title: string,
    image: string,
    price: number,
    artist: string,
    rarity: string,
    medium: string,
    showPrice?: boolean
}

export default function ArtworkCard({image, price, artist, rarity, medium, title, showPrice}: ArtworkCardType) {

    const image_href = getImageFileView(image, 300);

    return (
        <TouchableOpacity>
            <View style={styles.container}>
                <View style={styles.top}>
                    <Image source={{uri: image_href}} style={styles.image} />
                    <View style={styles.likeContainer}>
                        <TouchableOpacity>
                            <View style={styles.likeButton}><Feather name='heart' size={20} /></View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.contentsContainer}>
                    <Text style={{fontSize: 16}}>{title}</Text>
                    <View style={styles.profileContainer}>
                        <Text style={styles.artistName}>{artist}</Text>
                    </View>
                    {showPrice && <Text style={{fontSize: 18, fontWeight: 600,marginTop: 15}}>${price.toLocaleString()}</Text>}
                    <View style={styles.tagsContainer}>
                        <Text style={styles.tags}>{medium}</Text>
                        <Text style={styles.tags}>{rarity}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    top: {
        width: '100%',
        maxHeight: 250,
        position: 'relative'
    },
    image: {
        width: '100%',
        objectFit: 'cover',
        height: '100%',
        // backgroundColor: colors.inputBorder
    },
    likeContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 20
    },
    likeButton: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white
    },
    contentsContainer: {
        backgroundColor: '#FAFAFA',
        padding: 20
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginTop: 10
    },
    artistName: {
        textDecorationLine: 'underline',
        fontSize: 14
    },
    profileImage: {
        height: 25,
        width: 25,
        borderRadius: 20,
        objectFit: 'cover',
        backgroundColor: colors.inputBorder
    },
    tagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
        paddingTop: 15,
        marginTop: 15,
        borderTopWidth: 1,
        borderColor: colors.inputBorder
    },
    tags: {
        fontSize: 12,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.inputBorder
    }
})