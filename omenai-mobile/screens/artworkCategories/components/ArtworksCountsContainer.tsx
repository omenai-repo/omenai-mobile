import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FilterButton from 'components/filter/FilterButton'
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';

export default function ArtworksCountsContainer({
    count,
    title
}: {count: number, title: string}) {
    const navigation = useNavigation<StackNavigationProp<any>>();
    
    return (
        <View style={styles.container}>
            <Text style={{flex: 1}}>{count} {title} artworks</Text>
            <View>
                <FilterButton handleClick={() => navigation.navigate(screenName.artworkCategoriesFilterModal)} />
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