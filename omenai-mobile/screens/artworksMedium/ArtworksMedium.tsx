import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import WithModal from 'components/modal/WithModal';
import Header from './components/Header';
import FilterButton from 'components/filter/FilterButton';
import { colors } from 'config/colors.config';
import MiniArtworkCardLoader from 'components/general/MiniArtworkCardLoader';
import { fetchArtworksByCriteria } from 'services/artworks/fetchArtworksByCriteria';
import { artworksMediumStore } from 'store/artworks/ArtworksMediumsStore';
import ArtworksMediumListing from './components/ArtworksMediumListing';
import { useModalStore } from 'store/modal/modalStore';
import { screenName } from 'constants/screenNames.constants';
import { artworksMediumFilterStore } from 'store/artworks/ArtworksMediumFilterStore';
import { fetchPaginatedArtworks } from 'services/artworks/fetchPaginatedArtworks';

export default function ArtworksMedium() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const route = useRoute();

    const { updateModal } = useModalStore()
    const { setArtworks, artworks, isLoading, setMedium, setIsLoading, pageCount, medium  } = artworksMediumStore();
    const { filterOptions, clearAllFilters } = artworksMediumFilterStore();

    const { catalog, image } = route.params as {catalog: string, image: string};

    useEffect(() => {
        setMedium(catalog)
    }, [])

    useEffect(() => {
        clearAllFilters()
        handleFetchArtworks()
    }, [])

    const handleFetchArtworks = async () => {
        setIsLoading(true);

        const res = await fetchPaginatedArtworks(
            pageCount,
            {...filterOptions, medium: [medium]}
        );
        if(res.isOk){
            setArtworks(res.data)
        }else{
            console.log(res)
            updateModal({message: `Error fetching ${catalog} artworks, reload page again`, modalType: 'error', showModal: true})
        }

        setIsLoading(false);
    }

    return (
        <WithModal>
            <Header image={image} goBack={()=>navigation.goBack()} />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={{zIndex: 100}}>
                    <FilterButton handleClick={() => navigation.navigate(screenName.artworkMediumFilterModal)}>
                        <Text style={styles.headerText}>{medium}</Text>
                    </FilterButton>
                </View>
                {isLoading && <MiniArtworkCardLoader />}
                {(!isLoading && artworks) && <ArtworksMediumListing data={artworks} />}
                <View style={{height: 100}} />
            </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.primary_black, 
        paddingVertical: 20
    },
})