import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, RefreshControl} from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from 'config/colors.config'
import { ScrollView } from 'react-native-gesture-handler'
import SearchInput from 'components/inputs/SearchInput'
import Filter from 'components/filter/Filter'
import HeaderWithTitle from 'components/header/HeaderWithTitle'
import ArtworksListing from './components/ArtworksListing'
import { artworkActionStore } from 'store/artworks/ArtworkActionStore'
import { artworkStore } from 'store/artworks/ArtworkStore'
import { filterStore } from 'store/artworks/FilterStore'
import { fetchPaginatedArtworks } from 'services/artworks/fetchPaginatedArtworks'
import { useNavigation } from '@react-navigation/native'
import { screenName } from 'constants/screenNames.constants'
import FilterButton from 'components/filter/FilterButton'
import Loader from 'components/general/Loader'
import WithModal from 'components/modal/WithModal'
import { useModalStore } from 'store/modal/modalStore'

type TagItemProps = {
    name: string,
    isSelected: boolean,
}

const tags = [
    'All collections',
    'Live arts',
    'Sculptures'
]

export default function Catalog() {
    const [selectedTag, setSelectedTag] = useState(tags[0]);
    const { paginationCount } = artworkActionStore();
    const { updateModal } = useModalStore()
    const { setArtworks, artworks, isLoading, setPageCount, setIsLoading } = artworkStore();
    const { filterOptions, clearAllFilters } = filterStore();
    const [reloadCount, setReloadCount] = useState<number>(0);

    useEffect(() => {
        clearAllFilters()
        handleFecthArtworks()
    }, [reloadCount])

    const handleFecthArtworks = async () => {
        setIsLoading(true)
        setArtworks([])
        const response = await fetchPaginatedArtworks(
            paginationCount,
            {"medium": [], "price": [], "rarity": [], "year": []}
        );
        if (response?.isOk) {
            setArtworks(response.data);
            setPageCount(response.count);
        }else{
            updateModal({message: 'Error fetching artworks, reload page again', modalType: 'error', showModal: true})
        }
        setIsLoading(false)
    }

    return (
        <WithModal>
            <SafeAreaView>
                <View style={styles.mainContainer}>
                    <View style={{zIndex: 100}}>
                        <FilterButton>
                            <Text style={styles.headerText}>Catalog</Text>
                        </FilterButton>
                    </View>
                    <View style={{zIndex: 5}}>
                        {isLoading ?
                            <Loader />
                        :
                            <ScrollView
                                style={{height: '100%'}}
                                showsVerticalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl refreshing={false} onRefresh={() => setReloadCount(prev => prev + 1)} />
                                }
                            >
                                <ArtworksListing data={artworks} />
                                <View style={{height: 300}} />
                            </ScrollView>
                        }
                    </View>
                </View>
            </SafeAreaView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    topContainer: {
        paddingHorizontal: 20,
    },
    introText: {
        fontSize: 28,
        fontWeight: '500',
        color: colors.primary_black,
        maxWidth: 290,
        paddingVertical: 40
    },
    mainContainer: {
        marginTop: 10,
        paddingHorizontal: 20,
        paddingTop: 10
    },
    tagItem: {
        backgroundColor: '#FAFAFA',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginRight: 10
    },
    tagText: {
        fontSize: 12,
        color: colors.primary_black
    },
    headerText: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.primary_black, 
        paddingVertical: 20
    },
})