import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../config/colors.config'
import BackScreenButton from 'components/buttons/BackScreenButton'
import Filters from './components/filters/Filters'

export default function SearchResults() {
    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <SafeAreaView>
                    <BackScreenButton />
                </SafeAreaView>
                <Text style={styles.headerText}>Search for “Search Term”:</Text>
                <Filters />
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
    }
})