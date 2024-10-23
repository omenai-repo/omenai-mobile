import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'

export default function ArtworkCardLoader() {

    const ArtworkLoaderCard = () => {
        return(
            <View style={styles.container}>
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
        <FlatList
            data={[0,1]}
            renderItem={() => (
                <ArtworkLoaderCard />
            )}
            keyExtractor={(_, index) => JSON.stringify(index)}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 20}}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        width: 270,
        marginLeft: 20
    },
    imageContainer: {
        width: '100%',
        height: 250,
        backgroundColor: '#eee'
    },
    mainDetailsContainer: {
        marginTop: 10,
        flexDirection: 'row',
        gap: 10
    }
})