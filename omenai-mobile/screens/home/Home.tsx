import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../components/header/Header'
import { colors } from '../../config/colors.config'
import SearchInput from 'components/inputs/SearchInput'
import Coursel from './components/coursel/Coursel'
import Explore from './components/explore/Explore'
import { ScrollView } from 'react-native-gesture-handler'
import FeaturedGalleries from './components/featuredGalleries/FeaturedGalleries'
import Editorials from './components/editorials/Editorials'
import ListingHeader from './components/listingHeader/ListingHeader'
import ListingSelectContainer from './components/listingHeader/ListingSelectContainer'

export default function Home() {
    return (
        <View style={styles.container}>
            <Header />
            <ScrollView>
                <View style={styles.contentsContainer}>
                    <Text style={styles.introText}>Shop your favorite artworks and collections</Text>
                    <SearchInput />
                    <View style={styles.courselContainer}>
                        <Coursel />
                        <View style={{position: 'relative'}}>
                            <ListingHeader />
                            <Explore />
                            <ListingSelectContainer />
                        </View>
                        <FeaturedGalleries />
                        <Editorials />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    contentsContainer: {
        paddingHorizontal: 20,
        flex: 1,
        paddingBottom: 100
    },
    introText: {
        fontSize: 24,
        fontWeight: '500',
        color: colors.primary_black,
        maxWidth: 290,
        paddingVertical: 40
    },
    courselContainer: {
        marginTop: 30
    },
})