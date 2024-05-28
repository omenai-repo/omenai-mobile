import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import BackScreenButton from 'components/buttons/BackScreenButton'
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from 'config/colors.config';
import LongBlackButton from 'components/buttons/LongBlackButton';
import LongWhiteButton from 'components/buttons/LongWhiteButton';
import DetailsCard from './components/detailsCard/DetailsCard';
import ArtworkCard from 'components/artwork/ArtworkCard';
import { fetchsingleArtwork } from 'services/artworks/fetchSingleArtwork';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';

type RouteParamsType = {
    title: string;
};

export default function Artwork() {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const route = useRoute()

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ArtworkDataType | null>(null)

    let image_href
    if(data){
        image_href = getImageFileView(data.url, 300);
    }

    useEffect(() => {
        handleFecthSingleArtwork()
    }, []);

    const handleFecthSingleArtwork = async () => {
        setIsLoading(true)

        const { title } = route.params as RouteParamsType

        const results = await fetchsingleArtwork(title)

        if(results.isOk){
            setData(results.body.data)
        }else{
            setData(null)
        }

        setIsLoading(false)
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <SafeAreaView>
                <View style={{paddingHorizontal: 20}}>
                    <BackScreenButton handleClick={() => navigation.goBack()}/>
                </View>
            </SafeAreaView>
            {(isLoading && !data) && (
                <View style={styles.loaderContainer}>
                    <Text>Loading artwork data...</Text>
                </View>
            )}
            {data && (
                <ScrollView style={styles.scrollContainer}>
                    <Image source={{uri: image_href}} style={styles.image} />
                    <View style={styles.artworkDetails}>
                        <Text style={styles.artworkTitle}>{data?.title}</Text>
                        <Text style={styles.artworkCreator}>{data?.artist}</Text>
                        <Text style={styles.artworkTags}>{data?.materials}      |     {data?.rarity}</Text>
                        <View style={styles.tagsContainer}>
                            {data?.certificate_of_authenticity === 'Yes' && <View style={styles.tagItem}><Ionicons name='ribbon-outline' size={15} /><Text style={styles.tagItemText}>Certificate of authencity availiable</Text></View>}
                            <View style={[styles.tagItem, {backgroundColor: '#e5f4ff'}]}><SimpleLineIcons name='frame' size={15} /><Text style={[styles.tagItemText, {color: '#30589f'}]}>{data?.framing === 'Framed' ? "Frame Included" : "Artwork is not framed"}</Text></View>
                        </View>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceTitle}>Price</Text>
                        {data?.pricing.shouldShowPrice === 'Yes' && <Text style={styles.price}>${data?.pricing.price || 0}</Text>}
                    </View>
                    <View style={styles.buttonContainer}>
                        <LongBlackButton value='Purchase artwork' isDisabled={false} onClick={() => console.log('')} />
                        <LongWhiteButton value='Save artwork to favorites' onClick={() => console.log('')} />
                    </View>
                    <View style={styles.detailsContainer}>
                        <DetailsCard
                            title='Additional details about this artwork'
                            details={[
                                {name: 'Description', text: data?.artwork_description || 'N/A'},
                                {name: 'Materials', text: data.materials},
                                {name: 'Certificate of authenticity', text: data?.certificate_of_authenticity === 'Yes' ? 'Included' : 'Not included'},
                                {name: 'Artwork packaging', text: data?.framing},
                                {name: 'Signature', text: `Signed ${data?.signature}`},
                                {name: 'Year', text: data?.year}
                            ]}
                        />
                        <DetailsCard
                            title='Artist Information'
                            details={[
                                {name: 'Artist name', text: data?.artist},
                                {name: 'Birth Year', text: data?.artist_birthyear},
                                {name: 'Country', text: data?.artist_country_origin},
                            ]}
                        />
                    </View>
                    {/* <View style={styles.similarContainer}>
                        <Text style={styles.similarTitle}>Similar artwork</Text>
                        <View style={styles.artworksContainer}>
                            <View style={styles.singleColumn}>
                                <ArtworkCard
                                    title={'Artwork Title'}
                                    artist={'Artist name'}
                                    image={''}
                                    medium={'Oil'}
                                    price={25000}
                                    showPrice={true}
                                    rarity={'Unique'}
                                />
                            </View>
                            <View style={styles.singleColumn}>
                                <ArtworkCard
                                    title={'Artwork Title'}
                                    artist={'Artist name'}
                                    image={''}
                                    medium={'Oil'}
                                    price={25000}
                                    showPrice={true}
                                    rarity={'Unique'}
                                />
                            </View>
                        </View>
                    </View> */}
                </ScrollView>
            )}
            {(!isLoading && !data) && (
                <View style={styles.loaderContainer}>
                    <Text style={styles.loaderText}>No details of artwork</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: colors.white,
        marginTop: 10,
    },
    image: {
        height: 340,
        width: '100%',
        objectFit: 'contain'
    },
    artworkDetails: {
        marginTop: 20
    },
    artworkTitle: {
        color: colors.primary_black,
        fontSize: 20,
        fontWeight: '500'
    },
    artworkCreator: {
        fontSize: 16,
        color: colors.secondary_text_color,
        marginTop: 10
    },
    artworkTags: {
        color: colors.secondary_text_color,
        fontSize: 14,
        marginTop: 10
    },
    tagsContainer: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#E7F6EC'
    },
    tagItemText: {
        color: colors.secondary_text_color,
        fontSize: 12
    },
    priceContainer:  {
        marginVertical: 15,
        borderTopWidth: 1,
        borderTopColor: colors.inputBorder,
        borderBottomWidth: 1,
        borderBottomColor: colors.inputBorder,
        paddingVertical: 20
    },
    priceTitle: {
        color: colors.secondary_text_color,
        fontSize: 14
    },
    price: {
        fontSize: 22,
        fontWeight: '500',
        color: colors.primary_black,
        marginTop: 10
    },
    buttonContainer: {
        gap: 20
    },
    similarContainer: {
        marginTop: 50
    },
    similarTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: colors.primary_black
    },
    artworksContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 30
    },
    singleColumn: {
        flex: 1,
        gap: 20
    },
    loaderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loaderText: {
        fontSize: 16,
        color: colors.black
    },
    detailsContainer: {
        marginBottom: 100
    }
})