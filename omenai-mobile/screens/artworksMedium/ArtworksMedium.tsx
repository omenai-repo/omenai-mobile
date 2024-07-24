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

export default function ArtworksMedium() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const route = useRoute();

    const { updateModal } = useModalStore()
    const { filterOptions, clearAllFilters } = artworksMediumStore();

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState();

    const { medium, image } = route.params as {medium: string, image: string};

    useEffect(() => {
        clearAllFilters();
        console.log(filterOptions)
        handleFetchArtworks()
    }, [])

    const handleFetchArtworks = async () => {
        setIsLoading(true);

        const res = await fetchArtworksByCriteria(medium);
        if(res.isOk){
            setData(res.body.data)
            console.log(res.body)
        }else{
            updateModal({message: `Error fetching ${medium} artworks, reload page again`, modalType: 'error', showModal: true})
        }

        setIsLoading(false);
    }

    return (
        <WithModal>
            <Header image={image} goBack={()=>navigation.goBack()} />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={{zIndex: 100}}>
                    <FilterButton>
                        <Text style={styles.headerText}>{medium}</Text>
                    </FilterButton>
                </View>
                {isLoading && <MiniArtworkCardLoader />}
                {(!isLoading && data) && <ArtworksMediumListing data={data} />}
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