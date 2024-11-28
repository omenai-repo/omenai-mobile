import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { getGalleryLogoFileView } from 'lib/storage/getGalleryLogoFileView'

export default function Logo({url}:{url: string}) {
    let image = getGalleryLogoFileView(url, 120, 120);

    console.log(image)
    
    return (
        <Image 
            source={{uri: image}}
            style={styles.container} 
        />
    )
}

const styles = StyleSheet.create({
    container: {
        height: 132,
        width: 132,
        backgroundColor: colors.grey50,
        borderRadius: 70
    }
})