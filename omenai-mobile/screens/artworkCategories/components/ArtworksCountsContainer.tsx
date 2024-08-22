import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FilterButton from 'components/filter/FilterButton'

export default function ArtworksCountsContainer({
    count,
    title
}: {count: number, title: string}) {
    
    return (
        <View style={styles.container}>
            <Text style={{flex: 1}}>{count} {title} artworks</Text>
            <View>
                <FilterButton handleClick={() => {}} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10
    }
})