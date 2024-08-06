import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { colors } from 'config/colors.config';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import ArtworksListing from './components/ArtworksListing';
import MiniArtworkCard from 'components/artwork/MiniArtworkCard';
import MiniArtworkCardLoader from 'components/general/MiniArtworkCardLoader';
import { RefreshControl } from 'react-native-gesture-handler';
import { fetchArtworks } from 'services/artworks/fetchArtworks';
import { useModalStore } from 'store/modal/modalStore';
import ShowMoreButton from 'components/buttons/ShowMoreButton';
import { fetchCuratedArtworks } from 'services/artworks/fetchCuratedArtworks';
import Pagination from 'screens/catalog/components/Pagination';

export default function ArtworkCategories() {
    const route = useRoute()
    const { title } = route.params as {title: artworkListingType};

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [loadingMore, setLoadingmore] = useState<boolean>(false);

    const { updateModal } = useModalStore();

    useEffect(() => {
        handleFetchArtworks()
    }, []);

    const handleFetchArtworks = async () => {
        setIsLoading(true)
        
        let results

        if(title === "curated"){
            results = await fetchCuratedArtworks({page: pageNum});
            if(results.isOk){
                const resData = Array.isArray(results.body) ? results.body : [];
                const newArr = [...data, ...resData]

                setData(newArr)
            }else{
                updateModal({message: "Error fetching " + title + " artworks", showModal: true, modalType: 'error'})
            }
        }else{
            results = await fetchArtworks({listingType: title, page: pageNum});
            if(results.isOk){
                const resData = results.body.data
                const newArr = [...data, ...resData]
                setData(newArr)
            }else{
                updateModal({message: "Error fetching " + title + " artworks", showModal: true, modalType: 'error'})
            }
        } 

        setIsLoading(false)
        setLoadingmore(false)
    };

    const handlePagination = async ()  => {
        setLoadingmore(true)

        let response;

        if(title === "curated"){
            response = await fetchCuratedArtworks({page: pageNum + 1});
            if(response.isOk){
                const responseData = Array.isArray(response.body) ? response.body : [];
                const newArr = [...data, ...responseData]

                setData(newArr)
            }else{
                //throw error
            }
        }else{
            response = await fetchArtworks({listingType: title, page: pageNum + 1});
            if(response.isOk){
                const responseData = response.body.data
                const newArr = [...data, ...responseData]
                setData(newArr);
            }else{
                //throw error
            }
        }

        setPageNum(prev => prev + 1);
        setLoadingmore(false)
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <BackHeaderTitle title={title + ' artworks'} />
            {isLoading ?
                <View style={{paddingTop: 20, paddingHorizontal: 20}}>
                    <MiniArtworkCardLoader />
                </View>
            :
                <ScrollView
                    style={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={handleFetchArtworks} />
                    }
                >
                <ArtworksListing data={data} />
                <Pagination
                    count={pageNum} 
                    onPress={() => {
                        setPageNum(prev => prev + 1);
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