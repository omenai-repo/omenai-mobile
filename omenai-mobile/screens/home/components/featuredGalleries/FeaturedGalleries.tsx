import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../../../../config/colors.config'
import { Feather } from '@expo/vector-icons';
import galleryImage from '../../../../assets/images/gallery-banner.png';

export default function FeaturedGalleries() {

    const Gallery = () => {
        return(
            <View style={styles.gallery}>
                <Image source={galleryImage} style={styles.image} />
                <View style={styles.contentContainer}>
                    <Text style={{fontSize: 14, color: colors.primary_black}}>Name of gallery</Text>
                    <Text style={{fontSize: 12, marginTop: 5, color: '#858585'}}>Location of gallery</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={{marginTop: 40}}>
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 18, fontWeight: 500}}>Featured galleries</Text>
                </View>
                <View style={{flex: 1}}>
                    <TouchableOpacity>
                        <View style={styles.seeMoreButton}>
                            <Text style={{fontSize: 14, color: colors.primary_black}}>See more</Text>
                            <Feather name='arrow-right' color={colors.primary_black} size={18} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.featuredListing}>
                <Gallery />
                <Gallery />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    seeMoreButton: {
        height: 50,
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderRadius: 30,
        gap: 10
    },
    featuredListing: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 20
    }, 
    gallery: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ebebeb'
    },
    contentContainer: {
        backgroundColor: '#FAFAFA',
        padding: 20
    },
    image: {
        width: '100%'
    }
})