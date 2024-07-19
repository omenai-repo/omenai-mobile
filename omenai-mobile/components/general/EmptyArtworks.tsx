import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';

import emptyImage from '../../assets/icons/empty-artworks.png';

export default function EmptyArtworks({size, writeUp}: {size: number, writeUp?: string}) {
    return (
        <View style={styles.container}>
            <Image source={emptyImage} alt='' style={{height: size, width: size}} />
            <Text style={{textAlign: 'center'}}>{writeUp ? writeUp : 'No artwork available'}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 20,
        gap: 10
    }
})