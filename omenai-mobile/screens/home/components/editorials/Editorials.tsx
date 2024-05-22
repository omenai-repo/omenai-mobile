import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../../../../config/colors.config'
import { Feather } from '@expo/vector-icons';
import galleryImage from '../../../../assets/images/gallery-banner.png';

export default function Editorials() {

    const Editorials = () => {
        return(
            <View style={styles.card}>
                <Image source={galleryImage} style={styles.image} />
                <View>
                    <View style={styles.cardDetails}>
                        <Text style={{fontSize: 12, color: '#616161'}}>by Jane Doe</Text>
                        <View style={{height: 5, width: 5, borderRadius: 5, backgroundColor: '#616161'}} />
                        <Text style={{fontSize: 12, color: '#616161'}}>by Jane Doe</Text>
                    </View>
                    <Text style={{fontSize: 14, color: colors.primary_black, marginTop: 15, fontWeight: 500}}>Blog article header</Text>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize: 14, marginTop: 10, color: '#616161'}}>This is body content for the blog post. This is body content for the blog post. This is body content for the blog post. This is body content for the blog post. This is body content for the blog post.</Text>
                    <TouchableOpacity style={{flexWrap: 'wrap'}}>
                        <View style={styles.cardButton}>
                            <Text style={{color: colors.primary_black, fontSize: 14}}>Read the full article</Text>
                            <Feather name='arrow-right' size={20} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={{marginTop: 40}}>
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 18, fontWeight: 500}}>Editorials</Text>
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
                <Editorials />
                <Editorials />
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
    card: {
        flex: 1
    },
    cardDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginTop: 10
    },
    image: {
        width: '100%'
    },
    cardButton: {
        marginTop: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.primary_black,
    }
})