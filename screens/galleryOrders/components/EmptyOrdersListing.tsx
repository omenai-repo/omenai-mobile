import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import empty_artworks from '../../../assets/icons/clip_icon.png';

export default function EmptyOrdersListing({status}:{status: string}) {
    return (
        <View style={styles.container}>
            <Image source={empty_artworks} style={{height: 100, objectFit: 'contain'}} resizeMode="cover" />
            <Text style={{textAlign: 'center', marginTop: 40}}>No {status} orders at the moment</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        alignItems: 'center',
        paddingTop: 50
    }
})