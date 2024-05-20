import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import BackScreenButton from 'components/buttons/BackScreenButton'
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { colors } from 'config/colors.config';
import LongBlackButton from 'components/buttons/LongBlackButton';
import LongWhiteButton from 'components/buttons/LongWhiteButton';
import DetailsCard from './components/detailsCard/DetailsCard';
import ArtworkCard from 'components/artwork/ArtworkCard';

export default function Artwork() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <SafeAreaView>
                <View style={{paddingHorizontal: 20}}>
                    <BackScreenButton handleClick={() => navigation.goBack()}/>
                </View>
            </SafeAreaView>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.imageContainer}>

                </View>
                <View style={styles.artworkDetails}>
                    <Text style={styles.artworkTitle}>Artwork Title</Text>
                    <Text style={styles.artworkCreator}>Artwork creator</Text>
                    <Text style={styles.artworkTags}>Artwork medium | Artwork medium</Text>
                    <View style={styles.tagsContainer}>
                        <View style={styles.tagItem}><Text style={styles.tagItemText}>Unique</Text></View>
                        <View style={styles.tagItem}><Text style={styles.tagItemText}>Unique</Text></View>
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceTitle}>Price</Text>
                    <Text style={styles.price}>$12,000</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <LongBlackButton value='Purchase artwork' isDisabled={false} onClick={() => console.log('')} />
                    <LongWhiteButton value='Save artwork to favorites' onClick={() => console.log('')} />
                </View>
                <DetailsCard
                    title='Artwork Details'
                    details={[
                        {name: 'Description', text: 'This is a description of the painting. This is a description of the painting. This is a description of the painting. This is a description of the painting.'},
                        {name: 'Materials', text: 'Paint, Canvas, Brush'},
                        {name: 'Certificate of authenticity', text: 'Included'},
                        {name: 'Packaging', text: 'Rolled'},
                        {name: 'Signature', text: 'Signed by gallery'},
                        {name: 'Year', text: '1900'}
                    ]}
                />
                <DetailsCard
                    title='Artist Information'
                    details={[
                        {name: 'Birth Year', text: '2001'},
                        {name: 'Country', text: 'United States of America'},
                    ]}
                />
                <View style={styles.similarContainer}>
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
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: colors.white,
        marginTop: 30,
    },
    imageContainer: {
        height: 300,
        width: '100%',
        backgroundColor: '#E7F6EC',
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
        gap: 2,
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
    }
})