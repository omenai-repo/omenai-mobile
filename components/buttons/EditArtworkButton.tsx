import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'

export default function EditArtworkButton({handlePress}:{handlePress: ()=>void}) {
    return (
        <TouchableOpacity style={styles.mainContainer} onPress={handlePress}>
            <View style={styles.container}>
                <Feather name='edit-2' size={14} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 10,
        position: 'absolute',
        top: 0,
        right: 0
    },
    container: {
        height: 35,
        width: 35,
        borderRadius: 20,
        backgroundColor: '#ffffff90',
        alignItems: 'center',
        justifyContent: 'center',
        
    }
})