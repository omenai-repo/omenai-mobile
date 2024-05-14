import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config'
import BackScreenButton from 'components/buttons/BackScreenButton'
import Filters from './components/filters/Filters'
import ArtworkCard from 'components/artwork/ArtworkCard'

export default function SearchResults() {
    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <SafeAreaView>
                    <BackScreenButton />
                </SafeAreaView>
                <Text style={styles.headerText}>Search for “Search Term”:</Text>
                <Filters />
                <ScrollView style={{marginTop: 30}}>
                    <View style={styles.artworksContainer}>
                        <View style={styles.singleColumn}>
                            <ArtworkCard />
                            <ArtworkCard />
                        </View>
                        <View style={styles.singleColumn}>
                            <ArtworkCard />
                            <ArtworkCard />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    mainContainer: {
        flex: 1,
        paddingHorizontal: 20
    },
    headerText: {
        fontSize: 24,
        color: colors.primary_black, 
        paddingVertical: 20
    },
    artworksContainer: {
        flexDirection: 'row',
        gap: 20
    },
    singleColumn: {
        flex: 1,
        gap: 20
    }
})