import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from 'config/colors.config'
import { EvilIcons, Feather, Octicons } from '@expo/vector-icons'

export default function Coverage() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Covered by the Omenai Guarantee</Text>
            </View>
            <View style={styles.mainContainer}>
                <View style={styles.detailItem}>
                    <Feather name='lock' size={16} color={'#00000090'} />
                    <Text style={[styles.detailItemText]}>Secure Checkout</Text>
                </View>
                <View style={styles.detailItem}>
                    <Octicons name='verified' size={16} color={'#00000090'} />
                    <Text style={[styles.detailItemText]}>Authenticity Guarantee</Text>
                </View>
                <Text style={{textAlign: 'center', marginTop: 5, textDecorationLine: 'underline'}}>Learn more</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.inputBorder,
    },
    header: {
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primary_black
    },
    mainContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 15
    },
    detailItem: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    detailItemText: {
        color: '#858585',
        fontSize: 14,
        lineHeight: 20
    }
})