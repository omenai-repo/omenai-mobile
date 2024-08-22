import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused, useRoute } from '@react-navigation/native'
import { colors } from 'config/colors.config';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import ArtworksListing from './components/ArtworksListing';
import MiniArtworkCardLoader from 'components/general/MiniArtworkCardLoader';
import { RefreshControl } from 'react-native-gesture-handler';
import { fetchArtworks } from 'services/artworks/fetchArtworks';
import { useModalStore } from 'store/modal/modalStore';
import { fetchCuratedArtworks } from 'services/artworks/fetchCuratedArtworks';
import Pagination from 'screens/catalog/components/Pagination';
import ArtworksCountsContainer from './components/ArtworksCountsContainer';
import { artworkCategoriesStore } from 'store/artworks/ArtworkCategoriesStore';
import { fetchTrendingArtworks } from 'services/artworks/fetchTrendingArtworks';

export default function ArtworkCategories() {
    const isFocused = useIsFocused()
    const route = useRoute()
    const { title } = route.params as {title: artworkListingType};

    // const [data, setData] = useState([]);
    const [loadingMore, setLoadingmore] = useState<boolean>(false);

    const { updateModal } = useModalStore();
    const { artworks, setArtworks, isLoading, setIsLoading, pageCount, setPageCount, filterOptions, artworkCount, setArtworkCount, setCategory } = artworkCategoriesStore();

    useEffect(() => {
        if(isFocused){
            setCategory(title)
            handleFetchArtworks();
            console.log(filterOptions)
        }
    }, [filterOptions, isFocused]);

    const handleDataReset = () => {
        setArtworks([]);
        setPageCount(1);
        setArtworkCount(0);
    }

    const handleFetchArtworks = async () => {
        setIsLoading(true);
        
        let results

        if(title === 'curated'){
            results = await fetchCuratedArtworks({page: pageCount});
        }else if(title === 'trending'){
            results = await fetchTrendingArtworks({page: pageCount, filters: filterOptions});
        }else if(title === 'recent'){
            results = await fetchArtworks({listingType: title, page: pageCount});
        }

        console.log(results.data)

        let resData

        if(results){
            if(title === 'curated' || title === 'trending'){
                resData = results.data
            }else{
                resData = results.body.data
            }
            // const newArr = [...data, ...resData]
            setArtworks(resData)
            setArtworkCount(resData.length)
        }else{
            updateModal({message: "Error fetching " + title + " artworks", showModal: true, modalType: 'error'})
        }

        setIsLoading(false)
        setLoadingmore(false)
    };

    const handlePagination = async ()  => {
        setLoadingmore(true)

        let response;

        if(title === 'curated'){
            response = await fetchCuratedArtworks({page: pageCount + 1});
        }else if(title === 'trending'){
            response = await fetchTrendingArtworks({page: pageCount + 1, filters: filterOptions});
        }else if(title === 'recent'){
            response = await fetchArtworks({listingType: title, page: pageCount + 1});
        }

        if(response.isOk){
            const responseData = response.body.data
            const newArr = [...artworks, ...responseData];

            console.log(artworks[0].artist)
            console.log(responseData[0].artist)

            setArtworks(newArr);
            setArtworkCount(newArr.length)
        }else{
            //throw error
        }

        setPageCount(pageCount + 1);
        setLoadingmore(false)
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <BackHeaderTitle 
                title={title + ' artworks'} 
                callBack={handleDataReset}
            />
            {isLoading ?
                <View style={{paddingTop: 20, paddingHorizontal: 20}}>
                    <MiniArtworkCardLoader />
                </View>
            :
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={() => {
                        handleDataReset()
                        handleFetchArtworks()
                    }} />
                }
            >
                <ArtworksCountsContainer
                    count={artworkCount}
                    title={title}
                />
                <ArtworksListing data={artworks} />
                <Pagination
                    count={pageCount} 
                    onPress={() => {
                        setPageCount(prev => prev + 1);
                        handlePagination()
                    }}
                    isLoading={loadingMore}
                />
                <View style={{height: 300}} />
            </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    }
})