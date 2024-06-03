import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../../../../config/colors.config'
import { Feather } from '@expo/vector-icons';
import galleryImage from '../../../../assets/images/gallery-banner.png';
import { FlatList } from 'react-native-gesture-handler';

import gallery_one from '../../../../assets/images/gallery_one.png';

const data = [
    {
        image: 'https://thesun.my/binrepository/web-page-3-art-economy-art_4236330_20240603074729.jpg',
        articleHeader: 'Meet XinJin Pi, Chineese painter',
        writer: 'Oluwafemi',
        content: ''
    },
    {
        image: 'https://www.artnews.com/wp-content/uploads/2024/05/IMG_1784.jpg',
        articleHeader: 'Women Art taking over london',
        writer: 'Moses Martin',
        content: ''
    },
    {
        image: 'https://www.artnews.com/wp-content/uploads/2024/05/Fini_ART523873.jpeg?w=762',
        articleHeader: 'Black and White paintings on the rise',
        writer: 'Adeyinka Moses',
        content: ''
    },
];

type EditorialCardProps = {
    image: string,
    writer: string,
    articleHeader: string,
    content: string
}

export default function Editorials() {

    const Editorials = ({image, writer, articleHeader, content}: EditorialCardProps) => {
        return(
            <View style={styles.card}>
                <Image source={{uri: image}} style={styles.image} />
                <View>
                    <View style={styles.cardDetails}>
                        <Text style={{fontSize: 12, color: '#616161'}}>by {writer}</Text>
                        <View style={{height: 5, width: 5, borderRadius: 5, backgroundColor: '#616161'}} />
                        <Text style={{fontSize: 12, color: '#616161'}}>12th June, 2024</Text>
                    </View>
                    <Text style={{fontSize: 14, color: colors.primary_black, marginTop: 15, fontWeight: 500}}>{articleHeader}</Text>
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
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20}}>
                <Text style={{fontSize: 18, fontWeight: 500, flex: 1}}>Featured Galleries</Text>
            </View>
            <FlatList
                data={data}
                renderItem={({item}: {item: EditorialCardProps}) => (
                    <Editorials
                        image={item.image}
                        writer={item.writer}
                        content={item.content}
                        articleHeader={item.articleHeader}
                    />
                )}
                keyExtractor={(_, index) => JSON.stringify(index)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 20}}
            />
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
        width: 350,
        marginLeft: 20
    },
    cardDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginTop: 10
    },
    image: {
        width: '100%',
        height: 300
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