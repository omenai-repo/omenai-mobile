import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function AuthTabs() {

    const TabItem = () => {
        return(
            <TouchableOpacity style={styles.tabContainer}>
                <Text style={styles.tabText}>Tab Item 1</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <TabItem />
            <TabItem />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        gap: 15
    },
    tabContainer: {
        height: 45,
        flex: 1,
        backgroundColor: '#000',
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabText: {
        fontSize: 14,
        color: '#fff'
    }
})