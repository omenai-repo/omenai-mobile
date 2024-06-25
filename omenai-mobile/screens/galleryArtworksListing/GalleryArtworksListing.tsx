import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WithModal from 'components/modal/WithModal'
import { Feather } from '@expo/vector-icons'
import FittedBlackButton from 'components/buttons/FittedBlackButton'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { screenName } from 'constants/screenNames.constants'
import ArtworksListing from './components/ArtworksListing'
import { fetchAllArtworksById } from 'services/artworks/fetchAllArtworksById'
import Loader from 'components/general/Loader'

export default function GalleryArtworksListing() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [isloading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState([]);


    useEffect(() => {
        setIsLoading(true)
        async function handleFetchGalleryArtworks(){
            const results = await fetchAllArtworksById();
            setData(results.data)
            
            setIsLoading(false)
        };

        handleFetchGalleryArtworks()
    }, [])

    return (
        <WithModal>
            <SafeAreaView>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20}}>
                    <Text style={{fontSize: 20, flex: 1}}>Artworks</Text>
                    <FittedBlackButton value='Upload artwork' isDisabled={false} onClick={() => navigation.navigate(screenName.gallery.uploadArtwork)}>
                        <Feather name='plus' color={'#fff'} size={20} />
                    </FittedBlackButton>
                </View>
            </SafeAreaView>
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* TODO: ADD LISTING FOR GALLERY ARTWORKS */}
                {isloading ? <Loader /> : <ArtworksListing data={data} />}
            </ScrollView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
        // backgroundColor: '#ff0000',
        paddingTop: 20,
        marginTop: 20
    }
})