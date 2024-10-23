import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'

type ShowMoreButtonProps = {
    loading: boolean,
    onPress: ()=>void
}

export default function ShowMoreButton({loading, onPress}:ShowMoreButtonProps) {

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
            <View style={styles.buttonContainer}>
                <Text style={styles.text}>Show more</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        marginHorizontal: 'auto',
        marginTop: 30
    },
    buttonContainer: {
        height: 45,
        paddingHorizontal: 30,
        backgroundColor: colors.primary_black,
        borderRadius: 5,
        justifyContent: 'center'
    },
    text: {
        fontSize: 12,
        fontWeight: 500,
        color: colors.white
    }
})