import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';

import emptyImage from '../../assets/icons/empty-artworks.png';

export default function EmptyArtworks({size}: {size: number}) {
    return (
        <View style={styles.container}>
            <Image source={emptyImage} alt='' style={{height: size, width: size}} />
            <Text>No artwork available</Text>
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