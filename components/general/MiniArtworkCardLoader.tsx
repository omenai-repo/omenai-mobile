import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function MiniArtworkCardLoader() {
    const Card = () => {
        return(
            <View>
                <View style={styles.imageContainer} />
                <View style={styles.mainDetailsContainer}>
                    <View style={{flex: 1}}>
                        <View style={{height: 10, width: '100%', backgroundColor: '#eee'}} />
                        <View style={{height: 10, marginTop: 10, width: '50%', backgroundColor: '#eee'}} />
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{flex: 1, gap: 20}}>
                <Card />
                <Card />
                <Card />
            </View>
            <View style={{flex: 1, gap: 20}}>
                <Card />
                <Card />
                <Card />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 20,
        paddingHorizontal: 10
    },
    imageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#eee'
    },
    mainDetailsContainer: {
        marginTop: 10,
        flexDirection: 'row',
        gap: 10
    }
})