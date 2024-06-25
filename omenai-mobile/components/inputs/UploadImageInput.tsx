import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { Ionicons } from '@expo/vector-icons'

type UploadImageInputProps = {
    label: string
}

export default function UploadImageInput({label}: UploadImageInputProps) {
    return (
        <View style={{zIndex: 100}}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity activeOpacity={1}>
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                    <Ionicons name='image-outline' size={30} color={'#858585'} />
                    </View>
                    <Text style={{fontSize: 14, marginTop: 10}}>Click to upload image of artwork</Text>
                    <Text style={{fontSize: 12, textAlign: 'center', opacity: 0.5, marginTop: 5}}>(PNG, JPG formats acceptable. Max file size of 15MB)</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        color: colors.inputLabel
    },
    container: {
        height: 150,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.inputBorder,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconContainer: {
        height: 50,
        width: 50,
        borderRadius: 30,
        backgroundColor: '#EBEBEB',
        alignItems: 'center',
        justifyContent: 'center'
    }
})